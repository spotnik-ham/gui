import Head from 'next/head'
import React from 'react'
import Navigation from './Navigation'




const Header = () => (
	<div>
		<Head>
			<title>spotnik</title>
			<meta charSet="utf-8"/>
			<meta name="viewport" content="initial-scale=1.0, width=device-width"/>
			<link rel="icon" type="image/png" href="../static/favicon.png"/>
			{/* FIXME don't know how to webpack bundle this */}
			{/* <link href="notie/dist/notie.min.css" rel="stylesheet" type="text/css"/> */}
			<link href="../static/notie.min.css" rel="stylesheet" type="text/css"/>
			<link href="../static/bootstrap.min.css" rel="stylesheet" type="text/css"/>
			<script src="../static/jquery.slim.min.js"/>
			<script src="../static/bootstrap.min.js"/>
			
		</Head>
		<Navigation/>
	</div>
)

export default Header
