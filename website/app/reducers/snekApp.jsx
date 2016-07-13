import _ from 'underscore';
import {
    NETWORK_STATE_NONE,
    NETWORK_STATE_REQUESTING,
    NETWORK_STATE_FAILURE,
    NETWORK_STATE_SUCCESS,
    FETCH_REPO_LIST,
} from '../actions/actions.jsx'

export const defaultState = {
    repos: {},
    networkState: {},
    logs: {}
}

let snekApp = (state=initialState, action) => {
    if (responses.hasOwnProperty(action.type)) {
        return responses[action.type](state, action)
    } else {
        console.log('defaulting!')
        return responses.default(state, action)
    }
}

let networkHandler = (handler) =>
    (state, action) => {
        let newState = handler(state, action)
        newState.networkState[action.type] = action.network
        return newState
    }

let responses = {
    FETCH_REPO_LIST: networkHandler((state, action) => {
        switch(action.network) {
            case NETWORK_STATE_REQUESTING:
                return _(state).clone()
            case NETWORK_STATE_FAILURE:
                return _(state).clone()
            case NETWORK_STATE_SUCCESS:
                let newState = _(state).clone()
                newState.repos =  _(action.responseBody).extend(state.repos)
                return newState;
        }
    }),

    default: (state, action) => _(state).clone()
}

export default snekApp

