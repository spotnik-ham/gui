import React from 'react'
import Layout from '../components/Layout'
import fetch from '../lib/fetch'
import notie from '../lib/notie'

function restart() {
	fetch('/api/restart', { method: 'POST' })
		.then(() => notie.info('Restarting SvxLink.'))
		.catch(() => { })
}

function reboot() {
	fetch('/api/reboot', { method: 'POST' })
		.then(() => notie.info('Rebooting.'))
		.catch(() => { })
}

function poweroff() {
	fetch('/api/poweroff', { method: 'POST' })
		.then(() => notie.info('Powering off.'))
		.catch(() => { })
}


class Component extends React.Component {
	constructor(...args) {
		super(...args)
		this.state = {}
		this.getVersions = this.getVersions.bind(this)
	}

	async getVersions() {
		var gV = await fetch('/update')
		this.setState({ Versions: gV })
	}

	render() {
		return (
			<Layout>
				<div className="list-group">
					<div className="list-group-item flex-column align-items-center">
						<button type="button" onClick={restart} className="btn btn-danger">Restart SvxLink</button>
					</div>
					<div className="list-group-item flex-column align-items-center">
						<button type="button" onClick={reboot} className="btn btn-danger">Reboot</button>
					</div>
					<div className="list-group-item flex-column align-items-center">
						<button type="button" onClick={poweroff} className="btn btn-danger">Power Off</button>
					</div>
					<div className="list-group-item flex-column align-items-center">
						<button type="button" onClick={this.getVersions} className="btn btn-success">UpDate<br />{this.state.Versions}</button>
					</div>
				</div>
				<style jsx>{`
				.list-group-item {
					background-color: #fff6;
				}
				.list-group {
					display: inline-flex;
					margin-left : 10rem;
				}
			`}
				</style>
			</Layout>
		)
	}
}

export default Component
