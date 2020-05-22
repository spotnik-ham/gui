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
	constructor() {
		super()
		this.state = {
			versions: {}
		}

		this.getVersions = this.getVersions.bind(this)

	}


	async componentWillMount() {
		var gV = await this.getVersions()
		//console.log("componentWillMount : ", gV)
	}

	async getVersions() {
		try {
			var gV = await fetch('/update').then(res => res.json()).catch(err => { console.error(err) })
			this.setState({ versions: gV })
			return gV
		} catch (err) {
			console.error('erreur getVersions : ', err)
		}
	}


	render() {
		var V = this.state.versions
		var guiup2d = (V.guimaj === V.version_gui)
		var spotup2d = (V.spotnikmaj === V.version)
		var allup2d = (guiup2d && spotup2d)

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
						{allup2d &&
							<button type="button" onClick={this.getVersions} className="btn btn-success">
								Your Spotnik is up to date.<br />
							Spotnik : {V.version} - GUI : {V.version_gui}
							</button>}
						{!allup2d &&
							<button type="button" onClick={this.getVersions} className="btn btn-danger">
								UpDate available<br />
							Spotnik : {V.version} - GUI : {V.version_gui}<br />
							Spotnik_MAJ : {V.spotnikmaj} - GUI_MAJ : {V.guimaj}
							</button>}

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
