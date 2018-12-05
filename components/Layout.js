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
				//padding: 15px;
				//padding: 5%;
				//padding-top: 70px;
				padding-top: 7%;
				//width  : 10%;
				//height : 2%;
						
			}
		`}</style>
	</div>
)

export default Layout
