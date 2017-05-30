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

let Weapon = {
	damageType : 'piercing',
	baseDamage : '1d8',
	additionalCritDice : 2,
};

const Modifiers = {
	featRapidShot : {
		attackBonus   : -2,
		sequenceBonus : 1
	},
	featDeadlyAim : {
		attackBonus : -1 * ( 1 + Math.floor( Character.modifier.baseAttackBonus / 4 ) ),
		damageBonus :  2 * ( 1 + Math.floor( Character.modifier.baseAttackBonus / 4 ) )
	},
	buffGravityBow : {
		baseDamage : '2d6'
	},
	buffFlamingBurst : {
		damageType : 'fire',
		bonusDice : {
			hit : [ '1d6' ],
			crit : [ '1d6', '1d10' ]
		}
	}
};

export default class App extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			configuration : {},
			attackSequence : [],
			damageRolls : []
		};
		this.configurationUpdated = this.configurationUpdated.bind( this );
		this.modifyAttackSequence = this.modifyAttackSequence.bind( this );
	}
	
	configurationUpdated( state ) {
		this.setState({
			configuration : state
		}, () => { this.buildAttackSequence() });
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
			if( this.state.configuration.actionType == 'fullAttack' && this.validateModifier( key, 'sequenceBonus' ) ) {
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
	
	attackTeaser() {
		let attacks = [];
		this.state.attackSequence.map(
			( attack ) => {
				attacks.push( attack.attackBonus >= 0 ? "+" + attack.attackBonus : attack.attackBonus );
			}
		);
		return attacks.join( " / " );
	}
	
	buildAttackSequence() {
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
		}, () => { this.damageRolls(); });
	}
	
	modifyAttackSequence( id, result ) {
		let attackSequence = this.state.attackSequence;
		attackSequence[ id ].result = result;
		this.setState({
			attackSequence : attackSequence
		}, () => { this.damageRolls(); });
	}
	
	baseDamage() {
		let baseDamage = Weapon.baseDamage;
		for( var key in this.state.configuration ) {
			if( this.validateModifier( key, 'baseDamage' ) ) {
				baseDamage = Modifiers[ key ].baseDamage;
				break;
			}
		}
		return baseDamage;
	}
	
	bonusDamage() {
		return '+22';
	}
	
	bonusDice( attackResult ) {
		let dice = [];
		for( var key in this.state.configuration ) {
			if( this.validateModifier( key, 'bonusDice' ) ) {
				for( die in Modifiers[ key ].bonusDice[ attackResult ] ) {
					dice.push( Modifiers[ key ].bonusDice[ attackResult ][ die ] + ' ' + Modifiers[ key ].damageType );
				}
			}
		}
		return dice;
	}
	
	damageRolls() {
		let attacks = [];
		for( let count = 0; count < this.state.attackSequence.length; ++count ) {
			let baseDamage = this.baseDamage();
			let bonusDamage = this.bonusDamage();
			let attack = this.state.attackSequence[ count ];
			if( attack.result != 'miss' ) {
				let rolls = [];
				for( let arrow = 0; arrow < attack.arrows; ++arrow ) {
					if( attack.result == 'crit' && arrow == 0 ) {
						for( let critDice = 0; critDice < Weapon.additionalCritDice; ++critDice ) {
							rolls.push( baseDamage + bonusDamage + ' ' + Weapon.damageType );
						}
					}
					rolls.push( baseDamage + bonusDamage + ' ' + Weapon.damageType );
					const bonusDice = this.bonusDice( attack.result );
					for( die in bonusDice ) {
						rolls.push( bonusDice[ die ] );
					}
				}
				attacks[ count ] = rolls;
			}
		}
		this.setState({
			damageRolls : attacks
		}, () => { console.log( this.state.damageRolls ); });
	}
	
	render() {
		return (
			<div className="app">
				<Configuration updateCalculator={ this.configurationUpdated } />
				<div>
					{ this.attackTeaser() }
				</div>
				<ul className="attackSequence">
					{ this.state.attackSequence.map(
						( attack ) =>
							<Attack updateCalculator={ this.modifyAttackSequence } { ...attack } />
					) }
				</ul>
				<ul className="damageRolls">
					{ this.state.damageRolls.map(
						( attack, index ) =>
							<li key={ index }>
								{ index + 1 }
								<ul>
									{ attack.map(
										( roll, index ) => <li key={ index }>{ roll }</li>
									) }
								</ul>
							</li>
					) }
				</ul>
			</div>
		);
	}
};
