import React, { Component } from 'react'

function readableTimeDifference(t) {
	let d = Date.now() - t
	let second = 1000
	let minute = second * 60
	let hour = minute * 60
	let day = hour * 24
	if (d > day) {
		let count = Math.floor(d/day)
		return count + ' day' 	 + (count == 1 ? ' ago' : 's ago')
	} else if (d > hour) {
		let count = Math.floor(d/hour)
		return count + ' hour' 	 + (count == 1 ? ' ago' : 's ago')
	} else if (d > minute) {
		let count = Math.floor(d/minute)
		return count +  ' minute' + (count == 1 ? ' ago' : 's ago')
	} else if (d > second) {
		let count = Math.floor(d/second)
		return count +  ' second' + (count == 1 ? ' ago' : 's ago')
	}
}

let RepoPageBuildDetails = (props) => {
	let build = props.build

	console.log(props)

	// build list of package statuses
	let packageStatuses = [];
	let packages = build.package_status;
	for (let pkg in packages) {
		packageStatuses.push(<div className="package" key={pkg}>
			<span className="package-name">{pkg}</span>
			<span className={`package-status ${packages[pkg].status}`}>
				{packages[pkg].status}
			</span>
		</div>)
	}

	console.log(props);

	return (
		<div className={props.visible
				? 'repo-details visible'
				: 'repo-details'
			}>
			{packageStatuses}
		</div>
		)

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
					<time dateTime={buildTime.toISOString()}>
						{readableTimeDifference(buildTime)}
					</time>

					<span className="build-hash">
						{build.git.revision.substring(0,8)}
					</span>

					<p className='description'>
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

		console.log(repoDetails.log_entries)

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