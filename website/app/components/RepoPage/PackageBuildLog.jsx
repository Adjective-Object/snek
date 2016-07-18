import React, {Component} from 'react';

export default class PackageBuildLog extends Component {
  render() {
    return (<pre>
      {JSON.stringify(this.props.buildLog, null, 2)
        .replace(/\\n/g, '\n        ')
      }
    </pre>);
  }
}
PackageBuildLog.propTypes = {
  buildLog: React.PropTypes.object
};
