import React, {Component} from 'react';
import PackageStatus from './PackageStatus';
import PastTimer from '../common/PastTimer';
import BuildPackageList from './BuildPackageList';
import * as types from '../../types';

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

  constructor(props) {
    super(props);
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

                <BuildPackageList build={build}/>

            </div>
            );
  }
}
Build.propTypes = {
  build: types.build.isRequired,
  initialExpanded: React.PropTypes.bool
};
