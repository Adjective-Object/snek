import React, {Component} from 'react';
import { Link } from 'react-router';
import { makeRoute } from '../../util';

export default class PackageBuildLog extends Component {
  render() {
    let steps = [];
    for (let step in this.props.buildLog) {
      steps.push(
        <div className="build-log-step" key={ step }>
          <h3>{ step }</h3>
          <pre>
            { this.props.buildLog[step] }
          </pre>
        </div>
        );
    }

    return (
      <div className="logs">
        <h2>
          <Link to={makeRoute({
            repoId: this.context.pageLocation.repoId,
            buildId: this.context.pageLocation.buildId
          })}
                className="log-close-link"
                />

          {this.context.pageLocation.packageId}
        </h2>

        { steps }
      </div>
    );
  }
}
PackageBuildLog.propTypes = {
  buildLog: React.PropTypes.object
};
PackageBuildLog.contextTypes = {
  pageLocation: React.PropTypes.object
};

