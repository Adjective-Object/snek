import React, {Component} from 'react';
import PackageBuildSummary from './PackageBuildSummary';
import PastTimer from '../common/PastTimer';
import BuildPackageList from './BuildPackageList';
import * as types from '../../types';
import { makeRoute } from '../../util';

import { Link } from 'react-router';

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


export default class Build extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      // coerce to bool
      expanded: this.props.initialExpanded && true
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
            <div className={'packageStatusView' +
                (this.state.expanded
                    ? ' expanded'
                    : '')}

                data-state={currentBuildState}
                >

                <div className="build-short-summary"
                    onClick={() => this.setState({
                      expanded: !this.state.expanded
                    })}>

                    <PackageBuildSummary pkgStates={pkgStates}/>
                    <Link to={ makeRoute({
                      repoId: this.context.pageLocation.repoId,
                      buildId: this.props.buildId
                    }) }
                          className="permalink"
                          onClick={(e) => e.stopPropagation()}>
                      <PastTimer dateTime={buildTime} />
                    </Link>

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

                <BuildPackageList build={build} buildId={this.props.buildId}/>

            </div>
            );
  }
}
Build.propTypes = {
  build: types.build.isRequired,
  buildId: React.PropTypes.string,
  initialExpanded: React.PropTypes.bool
};
Build.contextTypes = {
  pageLocation: types.pageLocation
};
