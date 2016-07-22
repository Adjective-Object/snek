import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  NETWORK_STATE_NONE,
  FETCH_SERVER_ABOUT
} from '../../actions/actions';
import { tryPath } from '../../util';

export default class _IndexPage extends Component {
  // getChildContext() {
  //   return {};
  // }

  render() {
    return (
      <div>
          <h1>{this.props.serverName || '...' }</h1>
          <p>
              Loading server status..
          </p>
      </div>
    );
  }
}
_IndexPage.propTypes = {
  serverName: React.PropTypes.string,
  networkStateAbout: React.PropTypes.string
};

let IndexPage = connect(
    (state, ownProps) => {
      return {

        networkStateAbout:
          state.networkState[FETCH_SERVER_ABOUT] ||
          NETWORK_STATE_NONE,

        serverName: tryPath(state.about, ['name'])

      };
    }
    )(_IndexPage);

export default IndexPage;
