# snek


## Context
- `nix` is a package manager (like brew) that provides highly-reproducable
	builds
- Instruction for building these packages are stored in repositories of 
  *nix expressions* (package recipes)
- Existing CI servers aren't specialized enough to provide
  context on individual packages within a nix repo


## Archetypes
- **Bob the Builder** : Bob is a developer who is tired of setting up his
	tools on every new machine he works off of. He wants to maintain a personal
	collection of pre-configured tools with plugins to avoid setting them up
	repeatedly.

- **Mary the Manager** : An experienced developer who maintains a moderate-sized 
	open source repo of packages (~100-200). She wants to make sure that pull
	requests to her repo don't break any packages, and wants to view overall
	repository health & growth over time.

- **Chris the Continuous Integrator** : Chris is an experienced developer
	already familiar with existing integration services. She is investigating
	nix as a way to build shared libraries in her organization, and would like
	more granular information of the passing & failing states of each package.

- **Ned the Newbie** : A developer who is new to Nix. He wants something similar
	to the tools he already understands (i.e. jenkins, travis), and doesn't want
	to deal too much with the nix internals or setting up dependencies.

----

## Features
- Snek is a build server that monitors a nix repo for changes and automatically
	performs builds when it changes.
- The outputs of those builds are made available as a nix store (for download
	through the nix package manager
- A web interface is provided to show when packages are not building
	successfully to help find what broke them.


## Stories

Installing and configuring snek
Publish package
Download package
Viewing a Pull Request
Finding out what caused a package to break

### Installation
**Individual**: Ned  
**Software**: a terminal emulator, `tar`, and a web browser
**Scenario**:  
 1. Ned downloads a tar archive from the snek project site
 2. Ned untars the archive and runs the file inside it with his terminal client.
 	A url and a secret code are printed into the terminal.
 3. Ned navigates to the url printed to his terminal (snek instance) & is taken
 	through the initial onboarding

### Onboarding 




- Bob wants to deploy a copy of vim with a pre-configured set of plugins. He
	creates a package for it and adds it to his personal nix repository. He 
	then sets up a new machine and installs the package on it, downloading it
	from the build server.

- Mary receives a pull request to her repository on github from Ned. Ned's pull
	contains some careless mistakes, and it breaks a package and it's
	dependencies. She can see a post on the PR that says the build is broken,
	and if she wants, can click-through to see what packages were broken by Ned's
	changes.

- Ned is trying to set up a build server. He downloads a tar archive, extracts
	it, and runs the binary in the root of the folder. The first time he
	accesses the site, he is stepped through the process of adding his
	repository to the server.

- Chris is trying to deploy a statically generated website to gh-pages using her
	build server. She has a nix expression which describes how to generate the
	site, and push it to a remote host. However, pushing to the host relies 
	a on secrets file which should not be source controlled. She specifies these
	secrets on a per-package basis in the web interface.

- Chris gets an email in the middle of the night about how no one's builds are
	working anymore, and she needs to fix it immediately. She goes to the home
	page and sees a large spike in broken packages within the last few commits.
	She tracks down the commit ID & reverts master to the commit before the
	break.  
	Chris now has time to find out exactly why the packages broke without things
	being on fire.

----

## Mocks

### Language Used in Mocks

- Packages can be in one of three states during a build:
	- not started / in progress
	- successful
	- failed
- Builds consist of a series of steps, some of which are performed once per
	repository build, some of which are performed on each package individually.

### Index page

**Goal:** Show immediately relevant high-level information for any of the above
	user archetypes.

![index](./snek-index-small.jpg)



- Build results of most recent builds for each repository
- Change in number of broken and overall packages in each repository
- Changes in package health in the most recent build of each repository
	(newly broken and newly fixed packages)

### Log view

**Goal:** Provide detailed information about builds performed for each repository,
	including the status of every package in the repository, and the information
	logged in each build step of a package.

![log](./snek-log-view-small.jpg)

- Display high level history of package builds & corresponding git commits
- Include hover hints to show the different states a package can be in
	(help teach about the different stats as represented to the user)
- Show build steps in click-through


## Conclusions / feedback so far
- I need to communicate the different states with more than just color for
	accessibility reasons
- I need to lay out
	- Settings page
	- Detailed repository health page (actually not sure what is useful
		here. Will need to talk to existing power-users of CI services
		managers of large servers)

- Consider:
	- Pull-request page (probably recycle a lot of the elements of the
		log view page, but including links to the relevant PRs in the left
		column)
	- Should pull requests even be considered right now? (security concerns)

- Header font could be thicker (will difficult to read on hires screens)
- Stories stories could be a [more formal](http://www.cs.cornell.edu/courses/cs5150/2015fa/slides/D2-use-cases.pdf) set of [scenarios](http://www.cs.cornell.edu/courses/cs5150/2015fa/materials.html#D) 