import React from 'react';
import { Link } from 'react-router';

import * as types from '../../types';
import { makeRoute, mapObjectKeys } from '../../util';

let BuildListEntry = (buildId, repoId, pkg, packageId) =>
  <Link to={ makeRoute({
    repoId,
    buildId,
    packageId
  })}
    className={ 'package ' + pkg.status }
    activeClassName="active"
    key={packageId}>

    <span className="package-name">{packageId}</span>
    <span className="package-status">
        {pkg.status}
    </span>
  </Link>;


let BuildPackageList = (props, context) =>
  <div className="package-list">
      {mapObjectKeys(
        props.build.package_status,
        (pkg, packageId) => BuildListEntry(
            props.buildId,
            context.pageLocation.repoId,
            pkg,
            packageId
          )
      )}
  </div>;

BuildPackageList.propTypes = {
  build: types.build,
  buildId: React.PropTypes.string
};
BuildPackageList.contextTypes = {
  pageLocation: types.pageLocation
};

export default BuildPackageList;
