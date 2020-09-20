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
				padding-top: 7%;
			}
		`}</style>
	</div>
)

export default Layout
