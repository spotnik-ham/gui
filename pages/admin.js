import React from 'react'
import Layout from '../components/Layout'
import fetch from '../lib/fetch'
import notie from '../lib/notie'

//var logstdout = []

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
			versions: {},
			logStdOut: ''
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

	updateX = () => {
		var es = new EventSource('/updatexec');
		es.addEventListener('stdout', function (event) {
			this.setState({ logStdOut: (this.state.logStdOut + event.data.toString('utf8')).replace(/\r\n?/g, '<br />').replace(/\n/g, '<br />') })
		});
		es.onmessage = (ev => {
			this.setState({ logStdOut: (this.state.logStdOut + ev.data.toString('utf8')).replace(/\r\n?/g, '<br />').replace(/\n/g, '<br />') })
			console; log('//>', ev.data)
			console.log('///>', ev.data.toString('utf8'))
		})

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
							<button type="button" className="btn btn-success">
								Your Spotnik is up to date.<br />
							Spotnik : {V.version} - GUI : {V.version_gui}
							</button>}
						{!allup2d &&
							<button type="button" className="btn btn-danger btn-version-new">
								<div className="bloc">
									<div>New version(s) available</div>
									<div>gui : {V.guimaj}</div>
									<div>spotnik : {V.spotnikmaj}</div>
								</div>
								<div className="bloc">
									<div>Your versions</div>
									<div>gui : {V.version_gui}</div>
									<div>spotnik : {V.version}</div>
								</div>
								<div className="bloc">
									<div onClick={update}>Click to update</div>
								</div>
							</button>}

					</div>
				</div>
				<div id="log">
					{this.state.logStdOut}
				</div>
				<style jsx>{`
				.list-group-item {
					background-color: #fff6;
				}
				.list-group {
					display: inline-flex;
					margin-left : 10rem;
				}
				.btn-version-new {
					display: grid;
					background-color: #fff6;
					padding: 0;
					margin: 1rem;
					border-radius: 0.25rem;
					border-color: #fff6;
				}
				.bloc {
					display: grid;
					background-color: #d9534f;
					margin: 0 0 2px 0;
					border-radius: 0.25rem;
					padding: .25rem .5rem;
				}
		`}
				</style>
			</Layout>
		)
	}
}

export default Component
