import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as types from '../types';

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
        );
  }
}
_RepoListPage.propTypes = {
  repos: React.PropTypes.objectOf(types.repo)
};

let RepoListPage = connect(
    state => {
      return {
        repos: state.repos
      };
    },
    dispatch => {}

    )(_RepoListPage);
_RepoListPage.propTypes = _RepoListPage.propTypes;


export default RepoListPage;
