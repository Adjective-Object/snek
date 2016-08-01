import React from 'react';
let string = React.PropTypes.string;
let shape = React.PropTypes.shape;
let objectOf = React.PropTypes.objectOf;
let number = React.PropTypes.number;

/* eslint-disable camelcase */
export let repo = shape({
  name: string,
  nixpkgs: string,
  url: string
});

export let build = shape({
  build_status: string,
  git: shape({
    msg: string,
    revision: string
  }),
  package_status: objectOf(shape({
    status: string
  })),
  time: number
});

export let repoDetails = shape({
  latest_build: string,
  log_entries: objectOf(build)
});

export let pageLocation = shape({
  repoId: React.PropTypes.string,
  buildId: React.PropTypes.string,
  packageId: React.PropTypes.string,
  subpageId: React.PropTypes.string
});

/* eslint-enable camelcase */
