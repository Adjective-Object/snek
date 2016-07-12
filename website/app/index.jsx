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

import { fetchRepoList } from './actions/actions.jsx'

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
  render() {
    let repoLinks = [];
    for (let key in this.props.repos) {
      console.log(key);
      repoLinks.push(
        <Link activeClassName="active" 
              to={"/repos/" + key}
              key={key}>
          {this.props.repos[key].name}
        </Link>
      );
    }

    return (
      <div id="app-root">
        <nav id="site-nav">
          <Link to="/">Snek</Link>
          {repoLinks}
          <hr/>
          <Link activeClassName="active" to="/about">About</Link>

        </nav>

        <ReactCSSTransitionGroup
          component="div"
          id="page"
          transitionName="page"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
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
    console.log(state);
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
        <Route path="repos" component={RepoListPage} />
        <Route path="repos/:repoId" component={RepoPage} />
        <Route path="about" component={AboutPage} />
      </Route>  
    </Router>
  );
}

store.dispatch(fetchRepoList())
  .then(() => console.log(store.getState()))

render((
  <Provider store={store}>
    <Application />
  </Provider>
), document.getElementById('react-host'))

