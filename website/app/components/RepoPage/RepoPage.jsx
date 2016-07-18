import React, { Component } from 'react';
import { connect } from 'react-redux';
import { tryPath } from '../../util';
import PackageBuildLog from './PackageBuildLog';

import {
    FETCH_REPO_LIST,
    FETCH_REPO_DETAILS,
    NETWORK_STATE_NONE,
    NETWORK_STATE_REQUESTING,
    NETWORK_STATE_FAILURE,
    NETWORK_STATE_SUCCESS
} from '../../actions/actions';
import * as types from '../../types';

import RepoPageBuildList from './RepoPageBuildList';


class _RepoPage extends Component {
  render() {
    if (this.props.repo) {
            // render repo if it exists
      return this.renderMainScreen();
    }

    switch(this.props.networkStateRepoList) {
    case NETWORK_STATE_REQUESTING:
      return this.renderLoadScreen();
    case NETWORK_STATE_FAILURE:
      return this.renderFailScreen();
    case NETWORK_STATE_SUCCESS:
      return this.renderMissingScreen();
    case NETWORK_STATE_NONE:
    default:
      return this.renderLoadScreen();
    }
  }

  renderMainScreen() {
    return (
          <div className="repo-main-page">
            <div className="build-list">
              <h1> { this.props.repo.name } </h1>
              { (this.props.repoDetails)
                  ? <RepoPageBuildList
                      repoDetails={ this.props.repoDetails }
                      selectedBuildId={ this.props.selectedBuildId } />
                  : <p>Loading details..</p> }
            </div>
            <div className="logs">
              <h2>log</h2>
                { (this.props.buildLog)
                    ? <PackageBuildLog buildLog={this.props.buildLog} />
                    : <p>Gimme a sec</p>
                }
            </div>
          </div>
          );
  }

  renderLoadScreen() {
    return (<div>
            <h1> Loading .. </h1>
            <p>
                Just hold on a minute!
            </p>
        </div>);
  }

  renderFailScreen() {
    return (<div>
            <h1> Failure! </h1>
            <p>
                Failed to fetch from server :(
            </p>
        </div>);
  }

  renderMissingScreen() {
    return (<div>
            <h1> Repo does not exist! </h1>
            <p>
                Whoops
            </p>
        </div>);
  }
}
_RepoPage.propTypes = {
  repo: types.repo,
  networkStateRepoList: React.PropTypes.string,
  repoDetails: types.repoDetails,
  selectedBuildId: React.PropTypes.string,
  selectedPackageId: React.PropTypes.string,
  // TODO type for this in types decl
  buildLog: React.PropTypes.object
};
_RepoPage.childContextTypes = {
  pageLocation: React.PropTypes.object
};

let RepoPage = connect(
    (state, ownProps) => {
      return {
        repo: tryPath(
                state.repos,
                [ ownProps.params.repoId ]
                ),

        repoDetails: tryPath(
                state.details,
                [ ownProps.params.repoId ]
                ),

        selectedBuildId: tryPath(
            ownProps.params,
            [ 'buildId' ]
          ),

        selectedPackageId: tryPath(
            ownProps.params,
            [ 'packageId' ]
          ),

        buildLog: tryPath(
          state.logs,
          [ownProps.params.buildId, 'packages', ownProps.params.packageId]
        ),

        networkStateRepoList:
                state.networkState[FETCH_REPO_LIST] ||
                NETWORK_STATE_NONE,

        networkStateRepoDetails:
                state.networkState[FETCH_REPO_DETAILS] ||
                NETWORK_STATE_NONE
      };
    }
    )(_RepoPage);

export default RepoPage;
