import React from 'react'
import Layout from '../components/Layout'

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
						<button type="button" className="btn btn-danger">Power Off</button>
					</p>
					<p>
						<button type="button" className="btn btn-danger">Reboot</button>
					</p>
				</div>
			</Layout>
		)
	}
}

export default Component
