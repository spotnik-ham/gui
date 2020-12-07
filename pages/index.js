import React from 'react'
import Layout from '../components/Layout'
import fetch from '../lib/fetch'
import notie from '../lib/notie'
import Fsm from '../lib/svxlink/fsm'
import { callbackify } from 'util';

import Perso from '../customize/indexCustom';


async function getVersion() {
	let response = await (await fetch('/getversion')).text();
	return response
}



class Component extends React.Component {
	constructor() {
		super()
		this.state = { tri: "1", Vspotnik: "" }

		this.handleNetworkChange = this.handleNetworkChange.bind(this)
		this.handleTriChange = this.handleTriChange.bind(this)
		//		this.getVersion = this.getVersion.bind(this)

	}

	componentWillMount() {
		this.setState(this.props)
		getVersion().then(gV => this.setState({ Vspotnik: gV }))

	}

	componentDidMount() {
		const es = new EventSource('/stream')

		const fsm = new Fsm(
			es,
			() => {
				this.setState(fsm)
			},
			this.props
		)

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
			body: network,
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

	handleTriChange(evt) {

		const Tri = evt.target.value;
		this.setState({ tri: Tri });

	}

	static getInitialProps() {
		return fetch('/api/svxlink').then(res => res.json())
	}

	/*	async getVersion() {
			try {
				await fetch('/getversion')
					.then(res => {
						console.log('fetch : ', res)
						return res.json()
					})
					.catch(err => { console.error(err) })
			} catch (err) {
				console.error('error getVersion : ', err)
			}
		}
	
	*/
	render() {
		if (this.state.nodes) {
			var nds = this.state.nodes.filter(() => { return true });
			if (this.state.tri === "1") {
				nds.sort();
			} else if (this.state.tri === "2") {
				nds.sort((a, b) => {
					var at = a.split(' ');
					if (at.length === 1) at[1] = 'a' + at[0];
					var bt = b.split(' ');
					if (bt.length === 1) bt[1] = 'a' + bt[0];

					if (at[1] < bt[1]) return -1;
					if (at[1] === bt[1]) return 0;
					if (at[1] > bt[1]) return 1;
				})
			}
		}

		var str = "" + this.state.Vspotnik;
		console.log('str : ', str);
		let V = null;
		if (str && (str !== "")) {
			var n = str.indexOf('.');
			V = str.substr(0, n);
			console.log('render >>> :');
			console.log(V);
		} else {
			console.log("str NOK !")
		}

		return (
			<Layout>
				<div className="form-inline selector">
					<label className="sr-only" htmlFor="network">
						Network
					</label>
					<select
						required
						name="network"
						className="form-control brdr"
						value={this.state.network}
						onChange={this.handleNetworkChange}
					>
						<option value="default"> 95 - Répéteur Perroquet</option>
						<option value="rrf"> 96 - Appel RRF</option>
						<option value="fon"> 97 - FON French Open Network</option>
						<option value="tec"> 98 - TEC Salon Technique</option>
						<option value="int"> 99 - INT Salon International</option>
						<option value="bav">100 - BAV Salon Bavardage</option>
						<option value="loc">101 - LOC Salon Local</option>
						<option value="exp">102 - EXP Salon Expérimental</option>
						<option value="el">103 - EL Réseau EchoLink</option>
						<option value="reg">104 - REG Salon Régional à créer</option>

						{(V === '4') &&
							<>
								<option value="fdv">105 - FDV Salon Digital Xwindow</option>
								<option value="num">106 - NUM Salon Numérique</option>
							</>
						}

						{Object.entries(Perso).map(([v, k]) => (<option value={k}>{v}</option>))}
					</select>

					<select name="tri" className="form-control brdr tri" value={this.state.tri}
						onChange={this.handleTriChange}
					>
						<option value="0">Pas de tri</option>
						<option value="1">Tri sur le nom complet</option>
						<option value="2">Tri sur l'indicatif uniquement</option>
					</select>

					{this.state.transmitter && (
						<button className="transmitter brdr bgrd">
							<strong>{this.state.transmitter.toUpperCase()}</strong>{' '}
							<img
								height="28"
								src={
									this.state.transmitter === this.props.node
										? '../static/transmit.svg'
										: '../static/receive.svg'
								}
							/>
						</button>
					)}
				</div>
				{
					<ol>

						{nds.map(name => (

							<button
								key={name}

								className={this.state.transmitter === name ? 'brdr transmitting' : 'brdr'}
							>

								{this.state.transmitter === name && (
									<img
										height="22"
										src={
											this.state.transmitter === this.props.node
												? '../static/transmit.svg'
												: '../static/receive.svg'
										}
									/>
								)}
								{name.toUpperCase()}


							</button>
						))}
					</ol>
				}

				<style jsx>{`
					.selector {
						margin: 3px 5px;
					}
					
					select {
						max-width: 400px;
					}

					.tri {
						margin-left: 50px;
					}
					.brdr {
						border: 1px solid #b22222;
					}
					.bgrd {
						background-color: white;
					}
					button{
						display: inline-block;
						padding: 5px;
						border: solid grey 1px;
						border-radius: 5px;
						margin: 3px 5px;
						text-align: left;
						background-color: white;
						color: black;
						font-size: 0.95em;
						width: 150px;
					}
					
					ol {
						padding: 1% 0%;
						margin-top: 15px;
						display: inline-grid;
						grid-template-columns: repeat(auto-fit, minmax( 150px,1fr));
						text-align: center;
						width: 100%;
					}

					ol img {
						float: right;
						
					}

					.transmitting {
						font-weight: bold;
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
