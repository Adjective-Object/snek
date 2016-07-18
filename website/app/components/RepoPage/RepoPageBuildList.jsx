import React, { Component } from 'react';
import Build from './Build';
import * as types from '../../types';

// page
export default class RepoPageBuildList extends Component {
  render() {
    let repoDetails = this.props.repoDetails;
    let latestBuildId = repoDetails.latest_build;
    if (!latestBuildId) {
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
                    initialExpanded={(latestBuildId === key)}/>
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
  latestBuildId: React.PropTypes.string
};
