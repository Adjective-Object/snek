import React, { Component } from 'react';
import PastTimer from './PastTimer';
import types from '../types';

let RepoPageBuildDetails = (props) => {
    // build list of package statuses
  let packageStatuses = [];
  let packages = props.build.package_status;
  for (let pkg in packages) {
    packageStatuses.push(
            <div className="package" key={pkg}>
                <span className="package-name">{pkg}</span>
                <span className={`package-status ${packages[pkg].status}`}>
                    {packages[pkg].status}
                </span>
            </div>
            );
  }

  return (
        <div className={props.visible
                ? 'repo-details visible'
                : 'repo-details'
            }>
            {packageStatuses}
        </div>
        );
};
RepoPageBuildDetails.propTypes = {
  build: types.build,
  visible: React.PropTypes.boolean
};

let getPkgStateCounts = (packageStates) => {
  let pkgStates = {
    success: 0,
    ongoing: 0,
    unstarted: 0,
    failure: 0
  };

  for (let pkg in packageStates) {
    let status = packageStates[pkg].status;
    pkgStates[status]++;
  }

  pkgStates.ongoing = pkgStates.ongoing + pkgStates.unstarted;
  delete pkgStates.unstarted;

  return pkgStates;
};

let PackageStatus = (props) => {
  let states = [];
  for (let pkgState in props.pkgStates) {
    states.push(
            <span
                className={'status-' + pkgState}
                key={pkgState}
                data-count={
                    props.pkgStates[pkgState]
                }
                >
                {props.pkgStates[pkgState]}
            </span>
            );
  }

  return (<span className="package-build-summary">
        { states }
    </span>);
};
PackageStatus.propTypes = {
  pkgStates: React.PropTypes.objectOf(React.PropTypes.number)
};

class RepoPageBuildDisplay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  render() {
    let build = this.props.build;

    let buildTime =
            new Date(build.time * 1000);

    let pkgStates = getPkgStateCounts(this.props.build.package_status);

    let currentBuildState = 'ongoing';
    for (let state of ['ongoing', 'failure', 'success']) {
      if (pkgStates[state] !== 0) {
        currentBuildState = state;
        break;
      }
    }

    return (
            <div className={
                this.state.visible
                    ? 'visible packageStatusView'
                    : 'packageStatusView'}

                data-state={currentBuildState}
                >

                <div className="build-short-summary"
                    onClick={() => this.setState({
                      visible: !this.state.visible
                    })}>

                    <PackageStatus pkgStates={pkgStates}/>
                    <PastTimer dateTime={buildTime} />

                    <div className="description">
                        <h2 className="build-hash">
                            {build.git
                                ? build.git.revision.substring(0, 8)
                                : 'fetching..'}
                        </h2>

                        { build.git
                            ? build.git.msg
                            : 'hold up a sec..' }
                    </div>

                </div>

                <RepoPageBuildDetails
                    build={build}
                    visible={this.state.visible}/>

            </div>
            );
  }
}
RepoPageBuildDisplay.propTypes = {
  build: types.build
};

// page
export default class RepoPageDetails extends Component {
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
                <RepoPageBuildDisplay
                    key={ key }
                    build={ repoDetails.log_entries[key] } />
                );
    }

    return (
            <div>
                { builds }
            </div>
            );
  }
}
RepoPageDetails.propTypes = {
  repoDetails: types.repoDetails,
  latestBuildId: React.PropTypes.string
};
