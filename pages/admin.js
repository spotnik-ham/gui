import React from 'react'
import notie from 'notie'
import Layout from '../components/Layout'
import fetch from '../lib/fetch'

function reboot() {
	fetch('/api/configuration', {method: 'POST'})
		.then(() => notie.alert({type: 'info', text: 'Rebooting.'}))
		.catch(() => {})
}

function poweroff() {
	fetch('/api/configuration', {method: 'POST'})
		.then(() => notie.alert({type: 'info', text: 'Powering off.'}))
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
