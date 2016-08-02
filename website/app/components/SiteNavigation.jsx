import * as types from '../types';
import React, { Component } from 'react';
import { Link } from 'react-router';

const figureOrder = (evt, upCallback, downCallback) => {
  let clickedElement = evt.nativeEvent.target;
  let activeElement = document.querySelector('#site-nav .active');

  if (activeElement &&
      (document.DOCUMENT_POSITION_PRECEDING &
       activeElement.compareDocumentPosition(clickedElement))) {
    upCallback();
  } else {
    downCallback();
  }
};

class RepoListEntry extends Component {
  setActive(isActive) {
    this.refs.container.classList.toggle('active', isActive);
  }

  render() {
    return (
      <section
        ref="container"
        className = {
          'repository ' +
          (this.props.active ? ' active' : '') }
        id={this.props.repoId}
        >
        <section className="content">

          {/* Primary nav (repo) */}
          <Link className="repo-name"
                to={'/repos/' + this.props.repoId}
                onClick={(e) => this.props.onClick(e, this.props.repoId)}
                >
            {this.props.repoName}
          </Link>

          {/* subnav */}
          <section className={ 'details' + (' location-' + this.props.sublocation)}>
            {/* health indicator */}
            <aside className="repo-health-indicator">
              <i className="success" style={{flexGrow: 1}} data-pkg-count={1}/>
              <i className="ongoing" style={{flexGrow: 2}} data-pkg-count={2}/>
              <i className="failure" style={{flexGrow: 3}} data-pkg-count={3}/>
            </aside>

            <section className="subnav">
              <Link className="build-log-link"
                    to={'/repos/' + this.props.repoId }>
                Build Log
              </Link>
              <Link className="repo-health-link"
                    to={'/repos/' + this.props.repoId + '/health'}
                  >
                  Repository Health
              </Link>
              <Link className="configuration-link"
                    to={'/repos/' + this.props.repoId + '/config'}
                  >
                  Configuration
              </Link>
            </section>
          </section>
        </section>
      </section>
    );
  }
}

RepoListEntry.propTypes = {
  active: React.PropTypes.boolean,
  repoId: React.PropTypes.string,
  repoName: React.PropTypes.string,
  sublocation: React.PropTypes.string,
  upCallback: React.PropTypes.func,
  downCallback: React.PropTypes.func,
  onClick: React.PropTypes.func
};


class SiteNavigation extends Component {

  _repoSelected(evt, id) {
    figureOrder(evt, this.props.upCallback, this.props.downCallback);

    console.log('_repoSelected on', id);
    for (let repoId in this.refs) {
      console.log(repoId, id);
      this.refs[repoId].setActive(repoId === id);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return Object.keys(this.props.repos).length !== Object.keys(nextProps.repos).length;
  }

  render() {
    // build entries
    let repoLinks = [];
    for (let key in this.props.repos) {
      let currentActive = 'base';
      if (this.context.router.isActive('/repos/' + key + '/health', true)) {
        currentActive = 'health';
      } else if (this.context.router.isActive('/repos/' + key + '/config', true)) {
        currentActive = 'config';
      }
      repoLinks.push(
        <RepoListEntry
          ref={key}
          active={this.context.pageLocation.repoId === key}
          repoId={key}
          key={key}
          repoName={this.props.repos[key].name}
          sublocation={currentActive}
          upCallback={this.props.upCallback}
          downCallback={this.props.downCallback}
          onClick={this._repoSelected.bind(this)}
          />
      );
    }

    // render in container
    return (
      <nav id="site-nav">
        <section className="repositories">
          {repoLinks}
        </section>
        <section className="permalinks">
          <Link to="/docs" activeClassName="active">documentation</Link>
          <Link to="/about" activeClassName="active">about snek</Link>
        </section>
      </nav>
    );
  }

}
SiteNavigation.propTypes = {
  repos: React.PropTypes.objectOf(types.repo),
  upCallback: React.PropTypes.func,
  downCallback: React.PropTypes.func
};
SiteNavigation.contextTypes = {
  pageLocation: types.pageLocation,
  router: React.PropTypes.object
};

export default SiteNavigation;
