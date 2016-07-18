import React, { Component } from 'react';
import Build from './Build';
import * as types from '../../types';

// page
export default class RepoPageBuildList extends Component {

  render() {
    let repoDetails = this.props.repoDetails;
    let selectedBuildId = this.props.selectedBuildId || repoDetails.latest_build;
    if (!repoDetails.latest_build) {
      return (<div>
                No builds have been performed
            </div>);
    }

    let builds = [];
    for (let key of Object.keys(this.props.repoDetails.log_entries).sort().reverse()) {
      builds.push(
                <Build
                    key={ key }
                    build={ repoDetails.log_entries[key] }
                    buildId={ key }
                    initialExpanded={ selectedBuildId === key }/>
                );
    }

    return (
            <div>
                { builds }
            </div>
            );
  }
}
RepoPageBuildList.propTypes = {
  repoDetails: types.repoDetails,
  selectedBuildId: React.PropTypes.string
};
