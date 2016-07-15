import { log, err, warn } from './util'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { render } from 'react-dom'
import { 
    browserHistory, Router, Route, 
    IndexRoute, Link
} from 'react-router'

import IndexPage from './components/IndexPage'
import AboutPage from './components/AboutPage'
import RepoPage from './components/RepoPage'
import RepoListPage from './components/RepoListPage'

import * as actions from './actions/actions.jsx'

import './style/index.scss'

import snekApp, { defaultState } from './reducers/snekApp'
import { createStore, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'


const loggerMiddleware = createLogger()
const store = createStore(
  snekApp,
  defaultState,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)

class _App extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      direction: 'down'
    }

    this._figureOrder = this._figureOrder.bind(this)
  }

  _figureOrder(evt) {
    let clickedElement = evt.nativeEvent.target;
    let activeElement = 
      document.querySelector('#site-nav .active')

    if (activeElement &&
        (document.DOCUMENT_POSITION_PRECEDING & 
         activeElement.compareDocumentPosition(clickedElement))) {
      this.setState({direction: 'up'});
    } else {
      this.setState({direction: 'down'});
    }
  }

  render() {
    let repoLinks = []
    for (let key in this.props.repos) {
      repoLinks.push(
        <Link activeClassName="active" 
              to={"/repos/" + key}
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
            key: location.pathname
          })}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

const App = connect(
  state => {
    return {
      repos: state.repos,
    }
  },

  dispatch => {
    return {
      onTodoClick: (id) => {
        dispatch(toggleTodo(id))
      }
    }
  
  })(_App)

const Application = ({ children, location }) => {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={IndexPage}/>
        <Route path="repos" component={RepoListPage} 
                onEnter={ (nextState) => 
                  store.dispatch(
                    actions.fetchRepoList()
                  )
                } />
        <Route path="repos/:repoId" component={RepoPage}
                onEnter={ (nextState) =>
                  store.dispatch(
                    actions.fetchRepoDetails(nextState.params.repoId)
                  )
                }/>
        <Route path="about" component={AboutPage} />
      </Route>
    </Router>
  );
}

setTimeout(() => {
  store.dispatch(actions.fetchRepoList())
}, 400);

render((
  <Provider store={store}>
    <Application />
  </Provider>
), document.getElementById('react-host'))
