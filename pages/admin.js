import React from 'react'
import Layout from '../components/Layout'
import fetch from '../lib/fetch'
import notie from '../lib/notie'

function restart() {
	fetch('/api/restart', {method: 'POST'})
		.then(() => notie.info('Restarting SvxLink.'))
		.catch(() => {})
}

function reboot() {
	fetch('/api/reboot', {method: 'POST'})
		.then(() => notie.info('Rebooting.'))
		.catch(() => {})
}

function poweroff() {
	fetch('/api/poweroff', {method: 'POST'})
		.then(() => notie.info('Powering off.'))
		.catch(() => {})
}

class Component extends React.Component {
	constructor(...args) {
		super(...args)
		this.state = {}
	}

	render() {
		return (
			<Layout>
				<div>
					<p>
						<button type="button" onClick={restart} className="btn btn-danger">Restart SvxLink</button>
					</p>
					<p>
						<button type="button" onClick={reboot} className="btn btn-danger">Reboot</button>
					</p>
					<p>
						<button type="button" onClick={poweroff} className="btn btn-danger">Power Off</button>
					</p>
				</div>
			</Layout>
		)
	}
}

export default Component
