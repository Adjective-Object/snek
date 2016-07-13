import React, { Component } from 'react'
import { connect } from 'react-redux';

import {
    FETCH_REPO_LIST,
    NETWORK_STATE_NONE,
    NETWORK_STATE_REQUESTING,
    NETWORK_STATE_FAILURE,
    NETWORK_STATE_SUCCESS
} from '../actions/actions'

class _RepoPage extends Component {
    render() {
        let params = this.props.params;
        let repoId = params && params['repoId'];
        let repo = this.props.repos[repoId];

        if (repo) {
            // render repo if it exists
            return this.renderMainScreen(repo)
        } else if (
            this.props.networkState === NETWORK_STATE_REQUESTING) {
            // if we are requesting the list, render a loader
            return this.renderLoadScreen()
        } else if (
            this.props.networkState === NETWORK_STATE_FAILURE) {
            // if we failed to load the repo list, render an err
            return this.renderFailScreen()
        } else if (
            this.props.networkState === NETWORK_STATE_SUCCESS) {
            // if we got a list of repos and the current repo is not on that
            // list, render an error page.
            return this.renderMissingScreen()
        } else if (
            this.props.networkState === NETWORK_STATE_NONE) {
            // if we got a list of repos and the current repo is not on that
            // list, render an error page.
            return this.renderLoadScreen()
        }
    }

    renderMainScreen(repo) {
        return <div>
            <h1> { repo.name } </h1>
            <p>
                { "Content for page goes here" }
            </p>
        </div>
    }

    renderLoadScreen() {
        return <div>
            <h1> Loading .. </h1>
            <p>
                { "Content for page will go here" }
            </p>
        </div>
    }

    renderFailScreen () {
        return <div>
            <h1> Failure! </h1>
            <p>
                { "Failed to fetch from server" }
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
    state => {
        return {
            repos: state.repos,
            networkState : state.networkState[FETCH_REPO_LIST] || NETWORK_STATE_NONE
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