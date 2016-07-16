import React, { Component } from 'react'
import PastTimer from './PastTimer'

let RepoPageBuildDetails = (props) => {

	// build list of package statuses
	let packageStatuses = [];
	let packages = props.build.package_status
	for (let pkg in packages) {
		packageStatuses.push(
			<div className="package" key={pkg}>
				<span className="package-name">{pkg}</span>
				<span className={`package-status ${packages[pkg].status}`}>
					{packages[pkg].status}
				</span>
			</div>
			)
	}

	return (
		<div className={props.visible
				? 'repo-details visible'
				: 'repo-details'
			}>
			{packageStatuses}
		</div>
		)

}

let PackageStatus = (props) => {

	let pkgStates = {
		success: 0,
		ongoing: 0,
		unstarted: 0,
		failure: 0,
	}

	for (let pkg in props.build.package_status) {
		let status = props.build.package_status[pkg].status
		pkgStates[status]++
	}

	pkgStates.ongoing = pkgStates.ongoing + pkgStates.unstarted;
	delete pkgStates.unstarted;

	let states = [];
	for (let pkgState in pkgStates) {
		states.push(
			<span 
				className={'status-' + pkgState}
				key={pkgState}
				>
				{pkgStates[pkgState]}
			</span>
			)
	}

	return <span className='package-build-summary'>
		{ states }
	</span>


}

class RepoPageBuildDisplay extends Component {

	constructor(props) {
		super(props)
		this.state = {
			visible: false
		}
	}

	render() {
		let build = this.props.build

		let buildTime =
			new Date(build.time * 1000)

		return (
			<div className="packageStatusView"
				onClick={() => this.setState({
					visible: !this.state.visible
				})}>

				<div className="build-short-summary">
					<PackageStatus build={build}/>
					<PastTimer dateTime={buildTime} />

					<p className='description'>
						<h2 className="build-hash">
							{build.git.revision.substring(0,8)}
						</h2>

						{ build.git.msg }
					</p>

				</div>

				<RepoPageBuildDetails 
					build={build}
					visible={this.state.visible}/>

			</div>
			)

	}
}

// page
export default class RepoPageDetails extends Component {
	render() {
		let repoDetails = this.props.repoDetails
		let latestBuildId = repoDetails.latest_build
		if (! latestBuildId) {
			return <div>
				No builds have been performed
			</div>
		}

		let latestBuild = repoDetails.log_entries[latestBuildId]

		let builds = []
		for (let key in this.props.repoDetails.log_entries) {
			builds.push(
				<RepoPageBuildDisplay
					key={ key }
					build={ repoDetails.log_entries[key] } />
				)
		}

		return (
			<div>
				{ builds }
				<pre>
				{ JSON.stringify(this.props.repoDetails, null, '    ') }
				</pre>
			</div>
			)
	}
}