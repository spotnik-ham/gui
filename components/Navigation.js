import Link from 'next/link'
import React from 'react'

const Navigation = () => {
	return (
		<nav className="navbar navbar-toggleable-md navbar-light bg-faded">
			<button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"/>
			</button>
			<Link prefetch href="/">
				<a className="navbar-brand"><img src="../static/spotnik.png" width="30"/> spotnik</a>
			</Link>
			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<ul className="navbar-nav mr-auto">
					<li className="nav-item">
						<Link prefetch href="/">
							<a className="nav-link">home</a>
						</Link>
					</li>
					<li className="nav-item">
						<Link prefetch href="/keypad">
							<a className="nav-link">keypad</a>
						</Link>
					</li>
					<li className="nav-item">
						<Link prefetch href="/configuration">
							<a className="nav-link">configuration</a>
						</Link>
					</li>
					<li className="nav-item">
						<Link prefetch href="/admin">
							<a className="nav-link">admin</a>
						</Link>
					</li>
					<li className="nav-item">
						<Link prefetch href="/about">
							<a className="nav-link">about</a>
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	)
}

export default Navigation
