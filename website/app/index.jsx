import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { render } from 'react-dom';
import {
    browserHistory, Router, Route,
    IndexRoute
} from 'react-router';

import IndexPage from './components/IndexPage/IndexPage';
import AboutPage from './components/AboutPage';
import RepoPage from './components/RepoPage/RepoPage';

import SiteNavigation from './components/SiteNavigation';


import snekApp, { defaultState } from './reducers/snekApp';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import './style/index.scss';
import * as types from './types';
import { sliceAtNth, tryPath } from './util';
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
  }

  getChildContext() {
    return {
      pageLocation: {
        repoId: this.props.repoId,
        buildId: this.props.buildId,
        packageId: this.props.packageId,
        subpageId: this.props.subpageId
      }
    };
  }


  render() {
    return (
      <div id="app-root">
        <SiteNavigation
            upCallback ={ () => this.setState({direction: 'up'})}
            downCallback ={ () => this.setState({direction: 'down'})}
            repos={ this.props.repos }
          />

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
  children: React.PropTypes.object,
  buildId: React.PropTypes.string,
  packageId: React.PropTypes.string,
  repoId: React.PropTypes.string,
  subpageId: React.PropTypes.string
};
_App.childContextTypes = {
  pageLocation: types.pageLocation
};

const App = connect(
  (state, ownProps) => {
    return {
      repos: state.repos,

      repoId: tryPath(
          ownProps.params,
          [ 'repoId' ]
        ),

      buildId: tryPath(
          ownProps.params,
          [ 'buildId' ]
        ),

      packageId: tryPath(
          ownProps.params,
          [ 'packageId' ]
        ),

      subpageId: tryPath(
        ownProps,
        [ 'subpageId' ]
      )


    };
  })(_App);
App.propTypes = _App.propTypes;
App.childContextTypes = _App.childContextTypes;

const Application = ({ children, location }) => {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute
          component={IndexPage}
          onEnter={
            (nextState) => store.dispatch(actions.fetchServerAbout())
          }
          />
        <Route path="/about"
               component={AboutPage}/>
        <Route path="/repos/:repoId/health"
                component={RepoPage}
                // onEnter={
                //   (nextState) => {
                //     store.dispatch(
                //       actions.fetchRepoDetails(nextState.params.repoId)
                //     )
                //   }
                // }
                />
        <Route path="/repos/:repoId/config"
                component={RepoPage}
                // onEnter={
                //   (nextState) => {
                //     store.dispatch(
                //       actions.fetchRepoDetails(nextState.params.repoId)
                //     )
                //   }
                // }
                />
        <Route path="/repos/:repoId(/:buildId(/:packageId))"
                component={RepoPage}
                subpageId="repo"
                onEnter={
                  (nextState) => {
                    if (nextState.params.repoId) {
                      store.dispatch(
                        actions.fetchRepoDetails(nextState.params.repoId)
                      );
                    } else if (nextState.params.buildId) {
                      store.dispatch(
                        actions.fetchBuildLog(nextState.params.repoId)
                      );
                    }
                  }
                }/>
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
