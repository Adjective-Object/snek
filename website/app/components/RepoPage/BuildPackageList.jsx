import React from 'react';
import * as types from '../../types';
import { Link } from 'react-router';

let BuildPackageList = (props, context) => {
    // build list of package statuses
  let packageStatuses = [];
  let packages = props.build.package_status;
  for (let pkg in packages) {
    packageStatuses.push(
        <Link to={ `/repos/${context.pageLocation.repoId}/${context.pageLocation.buildId}/${pkg}` }
              className="package"
              key={pkg}>

              <span className="package-name">{pkg}</span>
              <span className={`package-status ${packages[pkg].status}`}>
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
  pageLocation: React.PropTypes.object
};


export default BuildPackageList;
