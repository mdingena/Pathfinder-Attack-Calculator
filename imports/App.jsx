import React, { Component } from 'react';
import Configuration from './Configuration';

const Character = {
	modifier : {
		baseAttackBonus : 9,
		strength        : 0,
		dexterity       : 6,
		size            : 0
	}
};

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
	
	attackSequence() {
		const numberOfAttacks = 'fullAttack' === ( this.state.configuration.actionType || 'fullAttack' ) ? 1 + Math.floor( ( Character.modifier.baseAttackBonus - 1 ) / 5 ) : 1;
		let attackSequence = [];
		for( let count = 0; count < numberOfAttacks; ++count ) {
			const attack = {
				key         : count,
				attackBonus : Character.modifier.baseAttackBonus
							  + Character.modifier.dexterity
							  - 5 * count
			};
			attackSequence.push( attack );
		}
		return attackSequence;
	}
	
	render() {
		const attackSequence = this.attackSequence();
		return (
			<div className="app">
				<Configuration updateCalculator={ this.configurationUpdated } />
				<ul className="attackSequence">
					{ attackSequence.map(
						( attack ) =>
							<li key={ attack.key }>attackBonus: { attack.attackBonus }</li>
					) }
				</ul>
			</div>
		);
	}
};
