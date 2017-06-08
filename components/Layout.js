import React from 'react'
import Header from './Header'

const Layout = props => (
	<div>
		<Header/>
		<div className="content">
			{props.children}
		</div>
		<style jsx>{`
			.content {
				padding: 15px;
			}
		`}</style>
	</div>
)

export default Layout
