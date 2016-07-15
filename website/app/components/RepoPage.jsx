import React, { Component } from 'react'
import { connect } from 'react-redux';
import { tryPath } from '../util'

import {
    FETCH_REPO_LIST,
    FETCH_REPO_DETAILS,
    NETWORK_STATE_NONE,
    NETWORK_STATE_REQUESTING,
    NETWORK_STATE_FAILURE,
    NETWORK_STATE_SUCCESS
} from '../actions/actions'

import RepoPageDetails from './RepoPageDetails'


class _RepoPage extends Component {
    render() {
        if (this.props.repo) {
            // render repo if it exists
            return this.renderMainScreen()
        } else if (
            this.props.networkStateRepoList === NETWORK_STATE_REQUESTING) {
            // if we are requesting the list, render a loader
            return this.renderLoadScreen()
        } else if (
            this.props.networkStateRepoList === NETWORK_STATE_FAILURE) {
            // if we failed to load the repo list, render an err
            return this.renderFailScreen()
        } else if (
            this.props.networkStateRepoList === NETWORK_STATE_SUCCESS) {
            // if we got a list of repos and the current repo is not on that
            // list, render an error page.
            return this.renderMissingScreen()
        } else if (
            this.props.networkStateRepoList === NETWORK_STATE_NONE) {
            // if we got a list of repos and the current repo is not on that
            // list, render an error page.
            return this.renderLoadScreen()
        }
    }

    renderMainScreen() {
        let detailPage = (this.props.repoDetails)
                ? <RepoPageDetails repoDetails={ this.props.repoDetails } />
                : <p>Loading details..</p>;
        return <div>
            <h1> { this.props.repo.name } </h1>
            { detailPage }
        </div>
    }

    renderLoadScreen() {
        return <div>
            <h1> Loading .. </h1>
            <p>
                Just hold on a minute!
            </p>
        </div>
    }

    renderFailScreen () {
        return <div>
            <h1> Failure! </h1>
            <p>
                Failed to fetch from server :(
            </p>
        </div>
    }

    renderMissingScreen() {
        return <div>
            <h1> Repo does not exist! </h1>
            <p>
                Whoops
            </p>
        </div>
    }

}

let RepoPage = connect(
    (state, ownProps) => {
        return {
            repo: tryPath(
                state.repos,
                [ ownProps.params.repoId ]
                ),

            repoDetails: tryPath(
                state.details, 
                [ ownProps.params.repoId ]
                ),

            networkStateRepoList: 
                state.networkState[FETCH_REPO_LIST] || 
                NETWORK_STATE_NONE,

            networkStateRepoDetails: 
                state.networkState[FETCH_REPO_DETAILS] ||
                NETWORK_STATE_NONE
        }
    },
    dispatch => {
        return {
            onTodoClick: (id) => {
                dispatch(toggleTodo(id))
            }
        }
    })(_RepoPage)

export default RepoPage;