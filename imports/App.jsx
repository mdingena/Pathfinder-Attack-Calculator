import React, { Component } from 'react';
import Configuration from './Configuration';
import Attack from './Attack';

const Character = {
	modifier : {
		baseAttackBonus : 9,
		strength        : 0,
		dexterity       : 6,
		size            : 0
	}
};

const Modifiers = {
	featRapidShot : {
		attackBonus   : -2,
		sequenceBonus : 1
	},
	featDeadlyAim : {
		attackBonus : -1 * ( 1 + Math.floor( Character.modifier.baseAttackBonus / 4 ) ),
		damageBonus :  2 * ( 1 + Math.floor( Character.modifier.baseAttackBonus / 4 ) )
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
	
	validateModifier( key, property ) {
		return this.state.configuration.hasOwnProperty( key ) && key.match( /^(feat|buff)/ ) && this.state.configuration[ key ] && Modifiers.hasOwnProperty( key ) && Modifiers[ key ].hasOwnProperty( property )
	}
	
	modifiedAttackBonus() {
		let attackBonus = 0;
		for( var key in this.state.configuration ) {
			if( this.validateModifier( key, 'attackBonus' ) ) {
				attackBonus = attackBonus + Modifiers[ key ].attackBonus;
			}
		}
		return attackBonus;
	}
	
	attackSequence() {
		const numberOfAttacks = 'fullAttack' === ( this.state.configuration.actionType || 'fullAttack' ) ? 1 + Math.floor( ( Character.modifier.baseAttackBonus - 1 ) / 5 ) : 1;
		const modifiedAttackBonus = this.modifiedAttackBonus();
		let attackSequence = [];
		for( let count = 0; count < numberOfAttacks; ++count ) {
			const attack = {
				key         : count,
				attackBonus : Character.modifier.baseAttackBonus
							  + Character.modifier.dexterity
							  + modifiedAttackBonus
							  - 5 * count
			};
			attackSequence.push( attack );
		}
		return attackSequence;
	}
	
	render() {
		return (
			<div className="app">
				<Configuration updateCalculator={ this.configurationUpdated } />
				<ul className="attackSequence">
					{ this.attackSequence().map(
						( attack ) =>
							<Attack { ...attack } />
					) }
				</ul>
			</div>
		);
	}
};
