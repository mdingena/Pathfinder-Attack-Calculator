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
			configuration : {},
			attackSequence : []
		};
		this.configurationUpdated = this.configurationUpdated.bind( this );
		this.attackResultsUpdated = this.attackResultsUpdated.bind( this );
	}
	
	configurationUpdated( state ) {
		this.setState({
			configuration : state
		}, () => { this.attackSequence() });
	}
	
	validateModifier( key, property ) {
		return this.state.configuration.hasOwnProperty( key ) && key.match( /^(feat|buff)/ ) && this.state.configuration[ key ] && Modifiers.hasOwnProperty( key ) && Modifiers[ key ].hasOwnProperty( property )
	}
	
	numberOfAttacks() {
		return 'fullAttack' === ( this.state.configuration.actionType || 'fullAttack' ) ? 1 + Math.floor( ( Character.modifier.baseAttackBonus - 1 ) / 5 ) : 1;
	}
	
	additionalAttacks() {
		let sequenceBonus = 0;
		for( var key in this.state.configuration ) {
			if( this.validateModifier( key, 'sequenceBonus' ) ) {
				sequenceBonus += Modifiers[ key ].sequenceBonus;
			}
		}
		return sequenceBonus;
	}
	
	numberOfArrows( attackId ) {
		let arrows = 1;
		if( this.state.configuration.actionType == 'fullAttack' && attackId === 0 ) {
			arrows += 1;
		}
		return arrows;
	}
	
	modifiedAttackBonus() {
		let attackBonus = 0;
		for( var key in this.state.configuration ) {
			if( this.validateModifier( key, 'attackBonus' ) ) {
				attackBonus += Modifiers[ key ].attackBonus;
			}
		}
		return attackBonus;
	}
	
	attackSequence() {
		const numberOfAttacks = this.numberOfAttacks();
		const additionalAttacks = this.additionalAttacks();
		const modifiedAttackBonus = this.modifiedAttackBonus();
		let attackSequence = [];
		for( let count = 0; count < numberOfAttacks + additionalAttacks; ++count ) {
			const attack = {
				key         : count,
				id          : count,
				arrows      : this.numberOfArrows( count + additionalAttacks ),
				attackBonus : Character.modifier.baseAttackBonus
							  + Character.modifier.dexterity
							  + modifiedAttackBonus
							  - 5 * ( count > 0 ? count : 0 ),
				result      : 'hit'
			};
			attackSequence.push( attack );
		}
		this.setState({
			attackSequence : attackSequence
		}, () => {
			console.log( this.state );
		});
	}
	
	attackResultsUpdated( id, result ) {
		let attackSequence = this.state.attackSequence;
		attackSequence[ id ].result = result;
		this.setState({
			attackSequence : attackSequence
		}, () => { console.log( this.state.attackSequence ); });
	}
	
	render() {
		let attacks = [];
		this.state.attackSequence.map(
			( attack ) => { attacks.push( attack.attackBonus ); }
		);
		return (
			<div className="app">
				<Configuration updateCalculator={ this.configurationUpdated } />
				<div>
					{ "+" + attacks.join( " / +" ) }
				</div>
				<ul className="attackSequence">
					{ this.state.attackSequence.map(
						( attack ) =>
							<Attack updateCalculator={ this.attackResultsUpdated } { ...attack } />
					) }
				</ul>
			</div>
		);
	}
};
