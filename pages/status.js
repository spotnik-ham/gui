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
				<h5>versions</h5>
				<p><strong>&nbsp;&nbsp;&nbsp;&nbsp;spotnik : </strong>{props.version}</p>
				<p><strong>&nbsp;&nbsp;&nbsp;&nbsp;gui : </strong>{props.version_gui}</p>
			</div>
			<div className="list-group-item flex-column align-items-start">
				<h5>temperature</h5>
				<p>{props.temperature}</p>
			</div>
		</div>
		<style jsx>{`
			.list-group-item {
				background-color: #fff6;
				border: 1px solid firebrick;
			}
			.list-group-item :first-child {
				border-top-right-radius: 0.8rem;
    			border-top-left-radius: 0.8rem;
			}
			.list-group-item :last-child {
				border-bottom-right-radius: 0.8rem;
				border-bottom-left-radius: 0.8rem;
			}
			.list-group {
				display: inline-flex;
			}
		`}
		</style>
		<style global jsx>{`
			.content {
				padding-top: 75px;
			}
		`}</style>
	</Layout>
)

Index.getInitialProps = async function () {
	return {
		uptime: await get('uptime'),
		memory: await get('memory'),
		ip: await get('ip'),
		datetime: await get('datetime'),
		version: await get('version'),
		version_gui: await get('version_gui'),
		network: await get('network'),
		temperature: await get('temperature'),
	}
}

export default Index
