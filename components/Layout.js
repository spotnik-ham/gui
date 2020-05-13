import React from 'react'
import Header from './Header'

const Layout = props => (
	<div>
		<Header />
		<div className="content">
			{props.children}
		</div>
		<style jsx>{`
			.content {
				padding-left: 10px;
				padding-right: 10px;
				padding-top: 57px;
			}
		`}</style>
		<style global jsx>{`
			html, body {
				background-color: red;
				background-image: url("../static/spotnik.jpg");
				min-height: 100%;
				background-size: cover;
			}
		`}</style>
	</div>
)

export default Layout
