import React from 'react';
import Build from './Build';
import * as types from '../../types';
import { mapObjectKeys } from '../../util';

let BuildFromLogEntry = (selectedBuildId) => (logEntry, key) =>
  <Build
    key={ key }
    build={ logEntry }
    buildId={ key }
    initialExpanded={ selectedBuildId === key }/>;


let RepoPageBuildList = (props, context) =>
    props.repoDetails.length
      ? <div> No builds have been performed </div>
      : <div>
            { mapObjectKeys(
                props.repoDetails.log_entries,
                BuildFromLogEntry(
                  context.pageLocation.buildId ||
                  props.repoDetails.latest_build)
                ).reverse() }
        </div>;

RepoPageBuildList.propTypes = {
  repoDetails: types.repoDetails
};
RepoPageBuildList.contextTypes = {
  pageLocation: types.pageLocation
};

export default RepoPageBuildList;
