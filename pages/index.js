import React from 'react'
import Layout from '../components/Layout'
import fetch from '../lib/fetch'
import notie from '../lib/notie'

class Component extends React.Component {
	constructor() {
		super()
		this.state = {
			network: '',
			nodes: [],
			talker: ''
		}
		this.handleNetworkChange = this.handleNetworkChange.bind(this)
	}

	getNodes() {
		return this.state.nodes.length > 0 ? this.state.nodes : this.props.nodes
	}

	handleEvent(event, args) {
		console.log('EventSource', event, args)
		if (event === 'ReflectorLogic.MsgNodeList') {
			this.setState({
				nodes: args
			})
		} else if (event === 'ReflectorLogic.MsgNodeLeft') {
			const nodes = [...this.getNodes()]
			const idx = nodes.indexOf(args[0])
			if (idx > -1) {
				nodes.splice(idx, 1)
			}
			this.setState({
				nodes,
			})
		} else if (event === 'ReflectorLogic.MsgNodeJoined') {
			const nodes = [...this.getNodes()]
			nodes.push(args[0])
			this.setState({
				nodes,
			})
		} else if (event === 'spotnik.network') {
			this.setState({
				network: args[0],
				nodes: [],
			})
		} else if (event === 'ReflectorLogic.MsgTalkerStart') {
			this.setState({talker: args[0]})
		} else if (event === 'ReflectorLogic.MsgTalkerStop') {
			this.setState({talker: ''})
		}
	}

	componentDidMount() {
		const es = new EventSource('/stream')
		es.onerror = error => {
			console.error('EventSource error', error)
		}
		;[
			'ReflectorLogic.MsgNodeList',
			'ReflectorLogic.MsgNodeLeft',
			'ReflectorLogic.MsgNodeJoined',
			'ReflectorLogic.MsgTalkerStart',
			'ReflectorLogic.MsgTalkerStop',
			'spotnik.network',
			'SimplexLogic.digit',
			'Rx1.open',
			'Rx1.closed',
			'Tx1.on',
			'Tx1.off',
		].forEach(event => {
			es.addEventListener(event, evt => {
				this.handleEvent(evt.type, JSON.parse(evt.data)[0])
			})
		})
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
		const talker = this.state.talker || this.props.talker

		return (
			<Layout>
				<form className="form-inline">
					<label className="sr-only" htmlFor="network">Network</label>
					<select required name="network" className="form-control" value={this.state.network || this.props.network} onChange={this.handleNetworkChange}>
						<option value="rrf">RRF Réseau des Répéteurs Francophones</option>
						<option value="fon">FON French Open Network</option>
						<option value="echo">EL EchoLink</option>
						<option value="frn">FRN Free Radio Network</option>
					</select>
				</form>
				<span>{talker ? `Talker: ${talker}` : ''}</span>
				<ul className="list-group">
					{this.getNodes().map(name => (
						<li key={name} className="list-group-item justify-content-between">
							{name.toUpperCase()}
						</li>
					))}
				</ul>
				<style jsx>{`
          select {
						max-width: 80px;
  				}
					ul {
						max-width: calc(100% - 14px);
					}
        `}</style>
			</Layout>
		)
	}
}

export default Component
