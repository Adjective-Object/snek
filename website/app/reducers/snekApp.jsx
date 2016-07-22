import { warn } from '../util';
import {
    NETWORK_STATE_REQUESTING,
    NETWORK_STATE_FAILURE,
    NETWORK_STATE_SUCCESS,
    FETCH_REPO_LIST,
    FETCH_REPO_DETAILS,
    FETCH_BUILD_LOG,
    FETCH_SERVER_ABOUT
} from '../actions/actions.jsx';

import _ from 'underscore';

export const defaultState = {
  repos: {},
  details: {},
  networkState: {},
  logs: {},
  about: {}
};

let networkHandler = (handler) =>
    (state, action) => {
      let newState = handler(state, action);
      newState.networkState[action.type] = action.network;
      return newState;
    };

let identity = (state) => _(state).clone();
let responses = {
  [FETCH_REPO_LIST]: networkHandler((state, action) => {
    switch(action.network) {
    case NETWORK_STATE_REQUESTING:
    case NETWORK_STATE_FAILURE:
      return _(state).clone();
    case NETWORK_STATE_SUCCESS:
      let newState = _(state).clone();
      newState.repos = _(action.responseBody).extend(state.repos);
      return newState;
    default:
      return state;
    }
  }),

  [FETCH_REPO_DETAILS]: networkHandler((state, action) => {
    switch(action.network) {
    case NETWORK_STATE_REQUESTING:
    case NETWORK_STATE_FAILURE:
      return _(state).clone();
    case NETWORK_STATE_SUCCESS:
      let newState = _(state).clone();
      newState.details[action.repo] = action.responseBody;
      return newState;
    default:
      return state;
    }
  }),

  [FETCH_BUILD_LOG]: networkHandler((state, action) => {
    switch(action.network) {
    case NETWORK_STATE_REQUESTING:
    case NETWORK_STATE_FAILURE:
      return _(state).clone();
    case NETWORK_STATE_SUCCESS:
      let newState = _(state).clone();
      newState.logs[action.log] = action.responseBody;
      return newState;
    default:
      return state;
    }
  }),

  [FETCH_SERVER_ABOUT]: networkHandler((state, action) => {
    switch(action.network) {
    case NETWORK_STATE_REQUESTING:
    case NETWORK_STATE_FAILURE:
      return _(state).clone();
    case NETWORK_STATE_SUCCESS:
      let newState = _(state).clone();
      newState.about = action.responseBody;
      return newState;
    default:
      return state;
    }
  }),

  '@@redux/INIT': identity,
  default: identity
};


let snekApp = (state = defaultState, action) => {
  if (responses.hasOwnProperty(action.type)) {
    return responses[action.type](state, action);
  }

  warn('defaulting', action.type);
  return responses.default(state, action);
};

export default snekApp;
