import React from 'react'
import Layout from '../components/Layout'
import fetch from '../lib/fetch'


// https://github.com/zeit/next.js/issues/2069
// import api from '../lib/api'
// const isServer = typeof window === 'undefined'
// const get = isServer
//   ? (id) => api.get(id)
//   : (id) => fetch(`/api/${id}`).then(res => res.text())
function get(id) {
	return fetch(`/api/${encodeURIComponent(id)}`).then(res => res.text())
}

const Index = props => (
	<Layout>
		<div className="list-group">
			<div className="list-group-item flex-column align-items-start">
				<h5>uptime</h5>
				<p>{props.uptime}</p>
			</div>
			<div className="list-group-item flex-column align-items-start">
				<h5>memory</h5>
				<p>{props.memory}</p>
			</div>
			{/* <div className="list-group-item flex-column align-items-start">
				<h5>cpu</h5>
				<p>{props.cpu}</p>
			</div> */}
			<div className="list-group-item flex-column align-items-start">
				<h5>ip</h5>
				<p>{props.ip}</p>
			</div>
			<div className="list-group-item flex-column align-items-start">
				<h5>time</h5>
				{/* <p>{props.datetime}</p> */}
				<p>{
					new Date(props.datetime).toLocaleTimeString() + ' - ' +
					new Date(props.datetime).toLocaleDateString()}
				</p>
			</div>
			<div className="list-group-item flex-column align-items-start">
				<h5>version</h5>
				<p>{props.version}</p>
			</div>
			<div className="list-group-item flex-column align-items-start">
				<h5>temperature</h5>
				<p>{props.temperature}</p>
			</div>
			<div className="list-group-item flex column align-items-start">
				<h5>wifi</h5>
				<p></p>
			</div>
		</div>
	</Layout>
)

Index.getInitialProps = async function () {
	return {
		uptime: await get('uptime'),
		memory: await get('memory'),
		ip: await get('ip'),


//f4gbv wifi tests 070318 :
//wwwwwwwwwwwwwwwwwwwwwwwww

//gbv 080318pm:
//		wifi: await get('wifi'),

// gbv 110318:
//		wifi: await JSON.stringify(
//				fetch(`/api/${encodeURIComponent('wifi')}`)
//					.then(res => res.text())
//			),

//wwwwwwwwwwwwwwwwwwwwwwwww


		datetime: await get('datetime'),
		version: await get('version'),
		network: await get('network'),
		temperature: await get('temperature'),
	}
}

export default Index
