import React from 'react';
import * as types from '../../types';

import PackageBuildLog from './PackageBuildLog';
import RepoPageBuildList from './RepoPageBuildList';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

let RepoMainPage = (props, context) =>
  <div className="repo-main-page">
    <div className="build-list">
      <h1> { props.repo.name } </h1>
      { props.repoDetails
        ? <RepoPageBuildList
            repoDetails={ props.repoDetails }
            />

        : <p>Loading details..</p>
      }
    </div>
    <ReactCSSTransitionGroup
      id="log-transition-container"
      className={ context.pageLocation.packageId ? null : 'empty' }
      transitionName="log"
      transitionEnterTimeout={300}
      transitionLeaveTimeout={300}
      >
      { (() => {
        if (context.pageLocation.packageId && props.buildLog) {
          return <PackageBuildLog buildLog={props.buildLog} />;
        } else if (context.pageLocation.packageId) {
          return <p>Gimme a sec</p>;
        }
        return null;
      })() }
   </ReactCSSTransitionGroup>

  </div>;

RepoMainPage.propTypes = {
  repo: types.repo,
  repoDetails: types.repoDetails,
  buildLog: React.PropTypes.object
};
RepoMainPage.contextTypes = {
  pageLocation: types.pageLocation
};

export default RepoMainPage;
