import React from 'react';

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

export default PackageStatus;
