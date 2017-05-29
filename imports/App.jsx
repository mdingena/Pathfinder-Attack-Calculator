import React, { Component } from 'react';
import Configuration from './Configuration';

export default class App extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			configuration : {}
		};
		this.configurationUpdated = this.configurationUpdated.bind( this );
	}
	
	configurationUpdated( state ) {
		console.log( state );
		this.setState({
			configuration : state
		});
	}
	
	render() {
		return (
			<div className="app">
				<Configuration updateCalculator={ this.configurationUpdated } />
			</div>
		);
	}
};
