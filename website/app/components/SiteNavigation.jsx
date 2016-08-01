import * as types from '../types';
import React from 'react';
import { Link } from 'react-router';

const figureOrder = (evt, upCallback, downCallback) => {
  let clickedElement = evt.nativeEvent.target;
  let activeElement = document.querySelector('#site-nav .active');

  if (activeElement &&
      (document.DOCUMENT_POSITION_PRECEDING &
       activeElement.compareDocumentPosition(clickedElement))) {
    upCallback();
  } else {
    downCallback();
  }
};

const SiteNavigation = (props, context) => {
  let repoLinks = [];
  for (let key in props.repos) {
    let currentActive = 'base';
    if (context.router.isActive('/repos/' + key + '/health', true)) {
      currentActive = 'health';
    } else if (context.router.isActive('/repos/' + key + '/config', true)) {
      currentActive = 'config';
    }


    repoLinks.push(
        <section
          className = {
            'repository ' +
            (context.pageLocation.repoId === key ? ' active' : '') }
          key={key}
          >

          {/* Primary nav (repo) */}
          <Link className="repo-name"
                to={'/repos/' + key}
                onClick={(evt) =>
                  figureOrder(evt, props.upCallback, props.downCallback)}>
            {props.repos[key].name}
          </Link>

          {/* subnav */}
          <section className={ 'details' + (' location-' + currentActive)}>
            {/* health indicator */}
            <aside className="repo-health-indicator">
              <i className="success" style={{flexGrow: 1}} data-pkg-count={1}/>
              <i className="ongoing" style={{flexGrow: 2}} data-pkg-count={2}/>
              <i className="failure" style={{flexGrow: 3}} data-pkg-count={3}/>
            </aside>

            <Link className="build-log-link"
                  to={'/repos/' + key }>
              Build Log
            </Link>
            <Link className="repo-health-link"
                  to={'/repos/' + key + '/health'}
                >
                Repository Health
            </Link>
            <Link className="configuration-link"
                  to={'/repos/' + key + '/config'}
                >
                Configuration
            </Link>
          </section>
        </section>
      );
  }

  return(
      <nav id="site-nav">
        {repoLinks}
      </nav>
    );
};
SiteNavigation.propTypes = {
  repos: React.PropTypes.objectOf(types.repo),
  upCallback: React.PropTypes.func,
  downCallback: React.PropTypes.func
};
SiteNavigation.contextTypes = {
  pageLocation: types.pageLocation,
  router: React.PropTypes.object
};

export default SiteNavigation;
