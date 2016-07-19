import React, {Component} from 'react';

export default class PackageBuildLog extends Component {
  render() {
    let steps = [];
    for (let step in this.props.buildLog) {
      steps.push(
        <div className='build-log-step' key={ step }>
          <h3>{ step }</h3>
          <pre>
            { this.props.buildLog[step] }
          </pre>
        </div>
        )
    }
    return (
      <div>
        { steps }
      </div>
    );
  }
}
PackageBuildLog.propTypes = {
  buildLog: React.PropTypes.object
};
