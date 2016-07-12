import React, { Component } from 'react'
import { connect } from 'react-redux';

class _RepoPage extends Component {
    render() {
        let params = this.props.params;
        let repoId = params && params['repoId'];
        let repo = this.props.repos[repoId];

        console.log(this.props.repos, repoId);

        return (
            <div>
                <h1>{ repo.name }</h1>
                <p>
                    the index page
                </p>
            </div>
        )
    }
}

let RepoPage = connect(
    state => {
        return {
            repos: state.repos,
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