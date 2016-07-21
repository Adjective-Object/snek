import React from 'react';
import { mapObjectKeys } from '../../util';

let PackageStatus = (packageState, packageName) =>
  <span className={ 'status-' + packageName }
        key={ packageName }
        data-count={ packageState }
        >
      { packageState }
  </span>;


let PackageBuildSummary = (props) =>
  <span className="package-build-summary">
    { mapObjectKeys(props.pkgStates, PackageStatus) }
  </span>;

PackageBuildSummary.propTypes = {
  pkgStates: React.PropTypes.objectOf(React.PropTypes.number)
};

export default PackageBuildSummary;
