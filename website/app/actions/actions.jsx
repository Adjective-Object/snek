export const 
    NETWORK_STATE_REQUESTING = 'NETWORK_STATE_REQUESTING',
    NETWORK_STATE_FAILURE = 'NETWORK_STATE_FAILURE',
    NETWORK_STATE_SUCCESS = 'NETWORK_STATE_SUCCESS';

export const FETCH_REPO_LIST = 'FETCH_REPO_LIST';
export function fetchRepoList () {
    let url = '/api/repos'
    console.log(url);
    return dispatch => {
        dispatch({
            type: FETCH_REPO_LIST,
            network: NETWORK_STATE_REQUESTING
        })
        return fetch(url)
            .then((response) => {
                response.json()
                    .then((blob) => {
                        dispatch({
                            type: FETCH_REPO_LIST,
                            network: NETWORK_STATE_SUCCESS,
                            responseBody: blob
                        })
                    })
            })
            .catch((e) => {
                console.log(e);
                dispatch({
                    type: FETCH_REPO_LIST,
                    network: NETWORK_STATE_FAILURE
                })
            })
    };
}

