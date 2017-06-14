import React from 'react'
import Layout from '../components/Layout'
import fetch from '../lib/fetch'
import notie from '../lib/notie'
import Fsm from '../lib/svxlink/fsm'

class Component extends React.Component {
	constructor() {
		super()
		this.state = {}
		this.handleNetworkChange = this.handleNetworkChange.bind(this)
	}

	componentWillMount() {
		this.setState(this.props)
	}

	componentDidMount() {
		const es = new EventSource('/stream')

		const fsm = new Fsm(es, () => {
			this.setState(fsm)
		}, this.props)

		es.onerror = error => {
			console.error('EventSource error', error)
		}
	}

	handleNetworkChange(evt) {
		const previousNetwork = this.state.network
		const network = evt.target.value
		const headers = new Headers()
		headers.append('Content-Type', 'text/plain; charset=utf-8')
		fetch('/api/network', {
			method: 'POST',
			headers,
			body: network
		})
		.then(() => {
			notie.info('Restarting SvxLink...')
		})
		.catch(() => {
			this.setState({
				network: previousNetwork,
			})
		})
		this.setState({
			network,
			nodes: [],
		})
	}

	static getInitialProps() {
		return fetch('/api/svxlink').then(res => res.json())
	}

	render() {
		const isSupported = this.state.network === 'rrf' || this.state.network === 'fon'
		return (
			<Layout>
				<div className="form-inline">
					<label className="sr-only" htmlFor="network">Network</label>
					<select required name="network" className="form-control" value={this.state.network} onChange={this.handleNetworkChange}>
						<option value="rrf">RRF Réseau des Répéteurs Francophones</option>
						<option value="fon">FON French Open Network</option>
						<option value="echo">EL EchoLink</option>
						<option value="frn">FRN Free Radio Network</option>
					</select>
					{this.state.transmitter && <span className="transmitter"><strong>{this.state.transmitter.toUpperCase()}</strong> <img height="28" src={this.state.transmitter === this.props.node ? '../static/transmit.svg' : '../static/receive.svg'}/></span>}
				</div>
				{isSupported ? (
					<ul className="list-group">
						{this.state.nodes.map(name => (
							<li key={name} className="list-group-item justify-content-between">
								{this.state.transmitter === name ? <strong>{name.toUpperCase()}</strong> : name.toUpperCase()}
								{this.state.transmitter === name && <img height="28" src={this.state.transmitter === this.props.node ? '../static/transmit.svg' : '../static/receive.svg'}/>}
							</li>
						))}
					</ul>) :
					<div>Interactive display is not yet supported on this network.</div>
				}
				<style jsx>{`
          select {
						max-width: 80px;
  				}
					ul {
						max-width: calc(100% - 14px);
						margin-top: 15px;
					}

					ul img {
						position: absolute;
						right: 15px;
					}

					.transmitter {
						position: absolute;
						right: 50px;
					}
        `}</style>
			</Layout>
		)
	}
}

export default Component
