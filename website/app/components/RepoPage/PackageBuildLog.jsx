import React from 'react';
import { Link } from 'react-router';
import { makeRoute, mapObjectKeys } from '../../util';

let LogEntry = (stepLog, stepName) =>
  <div className="build-log-step" key={ stepName }>
    <h3>{ stepName }</h3>
    <pre>
      { stepLog }
    </pre>
  </div>;


let PackageBuildLog = (props, context) =>
  <div className="logs">
    <h2>
      <Link to={makeRoute({
        repoId: context.pageLocation.repoId,
        buildId: context.pageLocation.buildId
      })}
            className="log-close-link"
            />

      { context.pageLocation.packageId }
    </h2>

    { mapObjectKeys(props.buildLog, LogEntry) }
  </div>;

PackageBuildLog.propTypes = {
  buildLog: React.PropTypes.object
};
PackageBuildLog.contextTypes = {
  pageLocation: React.PropTypes.object
};

export default PackageBuildLog;

