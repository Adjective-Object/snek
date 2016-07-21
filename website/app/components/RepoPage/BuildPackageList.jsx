import React from 'react';
import { Link } from 'react-router';

import * as types from '../../types';
import { makeRoute } from '../../util';

let BuildPackageList = (props, context) => {
    // build list of package statuses
  let packageStatuses = [];
  let packages = props.build.package_status;
  for (let pkg in packages) {
    packageStatuses.push(
        <Link to={ makeRoute({
          repoId: context.pageLocation.repoId,
          buildId: context.pageLocation.buildId,
          packageId: pkg
        })}
          className={'package ' + (
            context.pageLocation.packageId === pkg
              ? 'active '
              : ' ') +
            (packages[pkg].status)}
          key={pkg}>

          <span className="package-name">{pkg}</span>
          <span className="package-status">
              {packages[pkg].status}
          </span>
        </Link>
            );
  }

  return (
        <div className="package-list">
            {packageStatuses}
        </div>
        );
};
BuildPackageList.propTypes = {
  build: types.build
};
BuildPackageList.contextTypes = {
  pageLocation: types.pageLocation
};


export default BuildPackageList;
