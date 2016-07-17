import React from 'react';
let string = React.PropTypes.string;
let shape = React.PropTypes.shape;
let objectOf = React.PropTypes.objectOf;
let number = React.PropTypes.number;

/* eslint-disable camelcase */
export let repos = shape({
  name: string,
  nixpkgs: string,
  url: string
});

export let build = shape({
  build_status: string,
  git: {
    msg: string,
    revision: string
  },
  package_status: objectOf({
    status: string
  }),
  time: number
});

export let repoDetails = shape({
  latest_build: string,
  log_entries: objectOf(build)
});

/* eslint-enable camelcase */
