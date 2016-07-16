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

function timerResolution(t) {
	let d = Date.now() - t
	let second = 1000
	let minute = second * 60
	for (let diff of [10 * minute, 5 * minute, minute]) {
		if (d >= diff) {
			return diff / 60;
		}
	}
	return second / 2;
}

export default class PastTime extends Component {
	componentDidMount() {
	  	this.timer = setInterval(
	  		this.tick.bind(this),
	  		timerResolution(this.props.dateTime)
	  	);
	}

	componentWillUnmount() {
        clearInterval(this.timer);
	}

	tick() {
		this.setState({})
	}

	render() {
		return <time dateTime={this.props.dateTime.toISOString()}>
			{readableTimeDifference(this.props.dateTime)}
		</time>
	}
}
