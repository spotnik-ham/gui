import React from 'react'
import Header from './Header'


const Layout = props => (
	<div>
		<Header/>
		<div className="content">
			<h1><center><img className="logo1" src="../static/spotnik.svg" /> Dashboard du <a target="_blank" href="https://f5nlg.wordpress.com/2015/12/28/nouveau-reseau-french-repeater-network/">Réseau des Répéteurs Francophones (RRF) <img className="logo2" src="../static/spotnik.svg" /> </a></center></h1>
			<audio src="http://rrf.f5nlg.ovh:8000/stream" controls></audio>
			{props.children}
		</div>
		<style jsx>{`
			.content {
				padding: 15px;
				padding-top: 70px;
			}

                        @keyframes tourne1 {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }

                        @keyframes tourne2 {
                            from { transform: rotate(180deg); }
                            to { transform: rotate(-180deg); }
                        }

                        .logo1 {
                            height: 50px;
                            animation: tourne1 12s linear 0s infinite;
                        }

                        .logo2 {
                            height: 50px;
                            animation: tourne2 12s linear 0s infinite;
                        }

		}</style>
	</div>
)
export default Layout
