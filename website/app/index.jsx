import React from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { render } from 'react-dom'
import { 
    browserHistory, Router, Route, 
    IndexRoute, Link
} from 'react-router'

import IndexPage from './components/IndexPage'
import AboutPage from './components/AboutPage'


const App = ({ children, location }) => (
  <div>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/about">About</Link></li>
    </ul>

    <ReactCSSTransitionGroup
      component="div"
      transitionName="example"
      transitionEnterTimeout={500}
      transitionLeaveTimeout={500}
    >
      {React.cloneElement(children, {
        key: location.pathname
      })}
    </ReactCSSTransitionGroup>
  </div>
)

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={IndexPage}/>
      <Route path="about" component={AboutPage} />
    </Route>
  </Router>
), document.getElementById('react-host'))

