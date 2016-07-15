import React, { Component } from 'react'

class RepoPagePackageStatusView extends Component {
	render() {
		let packageStatuses = [];
		let packages = this.props.packages;
		for (let pkg in packages) {
			console.log(pkg)
			packageStatuses.push(<div className="package" key={pkg}>
				<span className="package-name">{pkg}</span>
				<span className={`package-status ${packages[pkg].status}`}>
					{packages[pkg].status}
				</span>
			</div>)
		}
		return <div className="packageStatusView">
			<h2> Latest Build </h2>
			{packageStatuses}
		</div>
	}
}

class RepoPageHistoryView extends Component {
	render() {
		let build_summaries = []
		let keys = Object.keys(this.props.buildHistory).sort()
		for (let key of keys) {
			let build = this.props.buildHistory[key];
			build_summaries.push(<div>
				<date>{build.time}</date>
			</div>);
		}
		return <div>
			{build_summaries}
		</div>

	}
}

export default class RepoPageDetails extends Component {
	render() {
		let repoDetails = this.props.repoDetails
		let latestBuild = repoDetails.latest_build
		if (! latestBuild) {
			return <div>
				No builds have been performed
			</div>
		}
		let latestPackageStatus = 
			repoDetails.log_entries[latestBuild].package_status

		return <div>
			<RepoPagePackageStatusView packages={ latestPackageStatus } />

			<RepoPageHistoryView buildHistory={ repoDetails.log_entries } />
			<pre>
			{ JSON.stringify(this.props.repoDetails, null, '    ') }
			</pre>
		</div>
	}
}