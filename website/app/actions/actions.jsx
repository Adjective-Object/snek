import { log } from '../util';
import _ from 'underscore';

export const NETWORK_STATE_REQUESTING = 'NETWORK_STATE_REQUESTING';
export const NETWORK_STATE_FAILURE = 'NETWORK_STATE_FAILURE';
export const NETWORK_STATE_SUCCESS = 'NETWORK_STATE_SUCCESS';

function fetchApi(id, url, params = null, passthrough = {}) {
  let apiDispatch = dispatch => {
    log('fetchApi:', id, url, dispatch);
    dispatch({
      type: id,
      network: NETWORK_STATE_REQUESTING
    });
    return fetch(url)
      .then((response) => {
        response.json()
          .then((blob) => {
            dispatch(
              _({
                type: id,
                network: NETWORK_STATE_SUCCESS,
                responseBody: blob
              }).extend(passthrough)
            );
          });
      })
      .catch((e) => {
        log.error(e);
        dispatch(
          _({
            type: id,
            network: NETWORK_STATE_FAILURE
          }).extend(passthrough)
        );
      });
  };
  return apiDispatch;
}

export const FETCH_REPO_LIST = 'FETCH_REPO_LIST';
export const fetchRepoList = () => {
  return fetchApi(FETCH_REPO_LIST, '/api/repos');
};

export const FETCH_REPO_DETAILS = 'FETCH_REPO_DETAILS';
export const fetchRepoDetails = (id) => {
  return fetchApi(
    FETCH_REPO_DETAILS,
    '/api/repos/' + id,
    null,
    { repo: id }
  );
};

export const FETCH_BUILD_LOG = 'FETCH_BUILD_LOG';
export const fetchBuildLog = (id) => {
  return fetchApi(
    FETCH_BUILD_LOG,
    '/api/builds/' + id,
    null,
    { log: id }
  );
};

export const FETCH_SERVER_ABOUT = 'FETCH_SERVER_ABOUT';
export const fetchServerAbout = () => {
  return fetchApi(FETCH_SERVER_ABOUT, '/api/about');
};
