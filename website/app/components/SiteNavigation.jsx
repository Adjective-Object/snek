import * as types from '../types';
import React from 'react';
import { Link } from 'react-router';

const figureOrder = (evt, upCallback, downCallback) => {
  let clickedElement = evt.nativeEvent.target;
  let activeElement = document.querySelector('#site-nav .active');

  if (activeElement &&
      (document.DOCUMENT_POSITION_PRECEDING &
       activeElement.compareDocumentPosition(clickedElement))) {
    upCallback()
  } else {
    downCallback()
  }
}

const SiteNavigation = (props, context) => {
    let repoLinks = [];
    for (let key in props.repos) {
      repoLinks.push(
        <div 
          className = { context.pageLocation.repo === key ? 'active' : null }
          key={key}
          >
          <Link activeClassName="active"
                to={'/repos/' + key}
                onClick={(evt) => 
                  figureOrder(evt, props.upCallback, props.downCallback)}>
            {props.repos[key].name}
          </Link>
        </div>
      );
    }

    return(
      <nav id="site-nav">
        {repoLinks}
      </nav>
    );ind
}
SiteNavigation.propTypes = {
  upCallback: React.PropTypes.func,
  downCallback: React.PropTypes.func
}
SiteNavigation.contextTypes = {
  pageLocation: types.pageLocation
}

export default SiteNavigation
