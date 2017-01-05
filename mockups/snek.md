# snek

*designs for a simple nix build server*  
[mocks are available on google-drive][drive]

## Context
### nix
- **nix** is a package manager that provides highly-reproducable builds
	(similar to *brew*, *apt*, *yum*, or *dnf*).
- A **nix package** is a set of instructions (**build steps**) for making a
	piece of software from some input (usually the source code).
- **repositories** hold instructions for building these packages, and are 
	usually stored on something like github.
- A **build** is an attempt to use the directions in a nix package to make a
	piece of software.
- A **build log** is information about what is happening at each step of a
	build.

### snek
- Snek is a service that monitors nix repositories for changes.
- When a package has changed, snek tries to perform a build on it.
- When something goes wrong in a build, snek notifies the people who made the
	breaking changes.
- When a build goes well, the results are made available for download.

----

## Screens

### Onboarding

1. [authentication][mock-setup-auth]
2. [setting a password][mock-setup-password]
3. [adding the first repo][mock-setup-repo]

**Goal:** Get the user to perform initial configuration on the server

- Allow the user to configure the server from their browser (without editing
  configuration by hand)
- Put the server behind a password so not anyone can edit settings
- Get the user to add their first repo up front (site does nothing without a
  repo to build, but adding repositories is a rare enough action that it
  shouldn't have a prominent UI element in the index)


### [Index][mock-index]

**Goal:** Show immediately relevant high-level information about the status of
	all the tracked repositories

- Build results of most recent builds for each repository
- Change in number of broken and overall packages in each repository
- Changes in package health in the most recent build of each repository
	(newly broken and newly fixed packages)

### [Log View][mock-log]

**Goal:** Provide detailed information about builds performed for each
    repository, including the status of every package in the repository, and the
    information logged in each build step of a package.


- Display high level history of package builds & corresponding git commits
- Include hover hints to show the different states a package can be in
	(help teach about the different stats as represented to the user)
- Show build steps in click-through

### [Settings][mock-settings]

**Goal:** Allow the user to add new repositories and change the behavior of
	their snek index.


## User Archetypes
- **Bob the Builder** : Bob is a developer who spends a lot of time setting up
	work environments on every new machine he moves to. He wants to shorten
	the time it takes him to set up a work environment on a new machine.

- **Mary the Manager** : An experienced developer who maintains a moderate-sized 
	open source repo of packages (~100-200). She wants to make sure that pull
	requests to her repo don't break any packages, and wants to view overall
	repository health & growth over time.

<!--
- **Chris the Continuous Integrator** : Chris is an experienced developer
	already familiar with existing integration services. She is investigating
	nix as a way to build shared libraries in her organization, and would like
	more granular information of the passing & failing states of each package.
-->

- **Ned the Newbie** : A developer who is new to Nix. He wants something similar
	to the tools he already understands (i.e. jenkins, travis), and doesn't want
	to deal too much with the nix internals or setting up dependencies.


## Scenarios

### Installation
**Individual**: Ned (new user, familiar already with git)  
**Software**: a terminal emulator, `tar`, and a web browser  
**Scenario**: Ned is trying to set up a build server  

1. Ned downloads a tar archive from the snek project site
2. Ned untars the archive and runs the file inside it with his terminal client.
	A url and a secret code are printed into the terminal.
3. Ned opens his browser and navigates to the url printed to his terminal
4. Ned sees the [auth screen][mock-setup-auth], and follows the on-screen
	directions to authenticate himself as the owner of the server
5. Ned [sets his password][mock-setup-password].
6. Ned points his build server at his git repo on github

----

### Publishing a Package
**Individual**: Bob (user already familiar with nix)  
**Software**: nix installation  
**Scenario**: Bob is trying to publish a package and download it on his new
machine

1. Bob has a nix expression for an environment with a list of packages he
	depends on for a specific project
2. Bob adds the package to his personal repo and pushes a commit to github.
3. (behind the scenes, snek builds the package and makes it available for
	download)
3. Bob runs `nix-install` on his new machine and downloads the dev environment
	from his snek server.

### Reviewing a Pull Request
**Individual**: Mary (user managing a nix package repo)  
**Software**: nix installation  
**Scenario**: Mary receives a pull request and wants to review it

1. Mary gets a pull request to a repo she managed from her coworker on github
2. snek posts a comment in pull request reporting if the build succeeded or
	failed, and links to the build logs of any packages that failed.
3. If a package failed to build, Mary clicks the links in the snek comment
	and can see the build logs to figure out why it failed.
	She can then tell the person who created the pull request how to make their
	code acceptable to merge.


## TODO
 - Address the problem of package secrets

<style>

.markdown-body h2 {
	float: left;
	position: relative;
	border-bottom: none;
}

.markdown-body h2::after {
	content: "";
	display: block;
	left: -0.5em;
	right: -0.5em;
	bottom: 0;
	height: 5px;
	border-top: 2px solid #666666;
	border-bottom: 2px solid #666666;
}

.markdown-body h2 + * {
	clear: left !important;
}

.markdown-body :not(h2) + h3 {
	font-size: 1.5em;
	margin-top: 1em;
}

.markdown-body h3 + p{
	margin-top: 0;
}


.markdown-body h3 {
	margin-top: 0;
	margin-bottom: 0;
}

.markdown-body h1 {
	text-align: center;
	border: none;
}

.markdown-body h1 + p {
	text-align: center;
	border: none;
	width: 75%;
	margin-left: auto;
	margin-right: auto;
}


</style>

[drive]: https://drive.google.com/folderview?id=0B49HaENH_QKvR1ZrbTZOaTgxbTQ&usp=sharing
[mock-index]: https://drive.google.com/open?id=0B49HaENH_QKvSTRaNFo5cGFKbGs
[mock-log]: https://drive.google.com/open?id=0B49HaENH_QKvbG5kNVM3VVJReDg
[mock-settings]: https://drive.google.com/open?id=0B49HaENH_QKva1JnQ2NlM2pMcXc
[mock-setup-auth]: https://drive.google.com/open?id=0B49HaENH_QKvUHQ3ak9HZmp2bjg
[mock-setup-password]: https://drive.google.com/open?id=0B49HaENH_QKvRm1FaU9OWE8zM28
[mock-setup-repo]: https://drive.google.com/open?id=0B49HaENH_QKvUUZQaUlvdk9ONU0


[use-cases]: http://www.cs.cornell.edu/courses/cs5150/2015fa/slides/D2-use-cases.pdf
[scenarios]: http://www.cs.cornell.edu/courses/cs5150/2015fa/materials.html#D




