import React from 'react';
import * as types from '../../types';

let BuildPackageList = (props) => {
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
        <div className="package-list">
            {packageStatuses}
        </div>
        );
};
BuildPackageList.propTypes = {
  build: types.build
};

export default BuildPackageList;
