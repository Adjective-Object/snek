import { log } from '../util'

export const 
  NETWORK_STATE_REQUESTING = 'NETWORK_STATE_REQUESTING',
  NETWORK_STATE_FAILURE = 'NETWORK_STATE_FAILURE',
  NETWORK_STATE_SUCCESS = 'NETWORK_STATE_SUCCESS';

function fetchApi(id, url, params=null) {
  let apiDispatch = dispatch => {
    log("fetchApi:", id, url, dispatch);
    dispatch({
      type: id,
      network: NETWORK_STATE_REQUESTING
    })
    return fetch(url)
      .then((response) => {
        response.json()
          .then((blob) => {
            dispatch({
              type: id,
              network: NETWORK_STATE_SUCCESS,
              responseBody: blob
            })
          })
      })
      .catch((e) => {
        log.error(e);
        dispatch({
          type: id,
          network: NETWORK_STATE_FAILURE
        })
      })
  };
  return apiDispatch;
}

export const FETCH_REPO_LIST = 'FETCH_REPO_LIST';
export const fetchRepoList = () => {
  return fetchApi(FETCH_REPO_LIST, '/api/repos');
}

export const FETCH_REPO_DETAILS = 'FETCH_REPO_DETAILS'
export const fetchRepoDetails = (id) => {
  return fetchApi(FETCH_REPO_DETAILS, '/api/repos/' + id);
}
