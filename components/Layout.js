import React from 'react'
import Header from './Header'


const Layout = props => (
	<div>
		<Header/>
		<div className="content">
			<h2>
				<center>
					<img className="logo1" src="../static/spotnik.svg" />
					Dashboard du 
					<a target="_blank" 
						href="https://f5nlg.wordpress.com/2015/12/28/nouveau-reseau-french-repeater-network/">
						 Réseau des Répéteurs Francophones (RRF) 
						<img className="logo2" src="../static/spotnik.svg" /> 
					</a>
				</center>
			</h2>
			<audio src="http://rrf3.f5nlg.ovh:8000/stream" controls></audio>
			{props.children}
		</div>
		<style jsx>{`
			.content {
				//padding: 5px;
				//padding: 5%;
				//padding-top: 80px;
				padding-top: 1%;
				//width  : 10%;
				//height : 2%;
			
			}

                        

                        .logo1 {
                            height: 50px;
                           
                        }

                        .logo2 {
                            height: 50px;
                           
                        }
		`}</style>
	</div>

)
export default Layout
