import React, { Component } from 'react'
import { connect } from 'react-redux';

class _RepoListPage extends Component {
    render() {
        let repoList = [];
        for (let repo in this.props.repos) {
            repoList.push(
                <li key={repo}>
                    {this.props.repos[repo].name}
                </li>
            );
        }

        return (
            <div>
                <h1>Repos</h1>
                <ul>
                    { repoList }
                </ul>
            </div>
        )
    }
}

let RepoListPage = connect(
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
    })(_RepoListPage)

export default RepoListPage;