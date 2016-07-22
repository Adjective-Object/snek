import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { render } from 'react-dom';
import {
    browserHistory, Router, Route,
    IndexRoute, Link
} from 'react-router';

import IndexPage from './components/IndexPage/IndexPage';
import AboutPage from './components/AboutPage';
import RepoPage from './components/RepoPage/RepoPage';
import RepoListPage from './components/RepoListPage';


import snekApp, { defaultState } from './reducers/snekApp';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import './style/index.scss';
import * as types from './types';
import { sliceAtNth } from './util';
import * as actions from './actions/actions';

const loggerMiddleware = createLogger();
const store = createStore(
  snekApp,
  defaultState,
  applyMiddleware(

    // lets us dispatch() functions
    thunkMiddleware,

    // neat middleware that logs actions
    loggerMiddleware
  )
);

class _App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      direction: 'down'
    };

    this._figureOrder = this._figureOrder.bind(this);
  }

  _figureOrder(evt) {
    let clickedElement = evt.nativeEvent.target;
    let activeElement =
      document.querySelector('#site-nav .active');

    if (activeElement &&
        (document.DOCUMENT_POSITION_PRECEDING &
         activeElement.compareDocumentPosition(clickedElement))) {
      this.setState({direction: 'up'});
    } else {
      this.setState({direction: 'down'});
    }
  }

  render() {
    let repoLinks = [];
    for (let key in this.props.repos) {
      repoLinks.push(
        <Link activeClassName="active"
              to={'/repos/' + key}
              key={key}
              onClick={this._figureOrder}>
          {this.props.repos[key].name}
        </Link>
      );
    }

    return (
      <div id="app-root">
        <nav id="site-nav">
          <Link to="/"
                onClick={this._figureOrder}
                >
                Snek
          </Link>
          {repoLinks}
          <Link activeClassName="active"
                to="/about"
                onClick={this._figureOrder}
                >
                About
          </Link>
        </nav>

        <ReactCSSTransitionGroup
          component="div"
          id="page"
          transitionName={`page-slide-${this.state.direction}`}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {React.cloneElement(this.props.children, {
            key: sliceAtNth(location.pathname, '/', 3)
          })}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
_App.propTypes = {
  repos: React.PropTypes.objectOf(types.repo),
  children: React.PropTypes.object
};

const App = connect(
  state => {
    return {
      repos: state.repos
    };
  })(_App);
App.propTypes = _App.propTypes;

const Application = ({ children, location }) => {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={IndexPage}
                onEnter={ (nextState) => {
                  store.dispatch(actions.fetchServerAbout());
                }}

        />
        <Route path="repos" component={RepoListPage}
                onEnter={ (nextState) => {
                  store.dispatch(
                    actions.fetchRepoList()
                  );
                }} />
        <Route path="repos/:repoId" component={RepoPage}
                onEnter={ (nextState) =>
                  store.dispatch(
                    actions.fetchRepoDetails(nextState.params.repoId)
                  )
                }>
          <Route path=":buildId" component={RepoPage}
                onEnter={ (nextState) =>
                  store.dispatch(
                    actions.fetchBuildLog(nextState.params.buildId)
                  )
                }>
            <Route path=":packageId" component={RepoPage}/>
          </Route>
        </Route>
        <Route path="about" component={AboutPage} />
      </Route>
    </Router>
  );
};
Application.propTypes = {
  children: React.PropTypes.object,
  location: React.PropTypes.object
};

setTimeout(() => {
  store.dispatch(actions.fetchRepoList());
}, 400);

render((
  <Provider store={store}>
    <Application />
  </Provider>
), document.getElementById('react-host'));
