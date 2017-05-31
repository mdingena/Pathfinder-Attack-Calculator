import React, { Component } from 'react';
import Configuration from './Configuration';
import Attack from './Attack';

const Character = {
	paladinLevel : 9,
	modifier : {
		baseAttackBonus : 9,
		strength        : 0,
		dexterity       : 6,
		charisma        : 5,
		size            : 0
	}
};

let Weapon = {
	damageType : 'piercing',
	baseDamage : '1d8',
	additionalCritDice : 2,
	enhancementBonus : 1
};

const Modifiers = {
	featRapidShot : {
		actionTypes   : [ 'fullAttack' ],
		attackBonus   : -2,
		sequenceBonus : 1
	},
	featDeadlyAim : {
		actionTypes   : [ 'standard', 'fullAttack' ],
		attackBonus : -1 * ( 1 + Math.floor( Character.modifier.baseAttackBonus / 4 ) ),
		damageBonus :  2 * ( 1 + Math.floor( Character.modifier.baseAttackBonus / 4 ) )
	},
	buffGravityBow : {
		actionTypes   : [ 'standard', 'fullAttack' ],
		baseDamage : '2d6'
	},
	buffShockingBurst : {
		actionTypes   : [ 'standard', 'fullAttack' ],
		damageType : 'shocking',
		bonusDice : {
			hit : [ '1d6' ],
			crit : [ '1d6', '1d10' ]
		}
	},
	buffFlamingBurst : {
		actionTypes   : [ 'standard', 'fullAttack' ],
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
			panels : {
				configuration  : true,
				attackSequence : false,
				damageRolls    : false
			},
			configuration : {},
			attackSequence : [],
			damageRolls : [],
			attackTeaser : '',
			damageTeaser : ''
		};
		this.configurationUpdated = this.configurationUpdated.bind( this );
		this.modifyAttackSequence = this.modifyAttackSequence.bind( this );
		this.switchToPanel = this.switchToPanel.bind( this );
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
		let attackBonus = Weapon.enhancementBonus;
		for( var key in this.state.configuration ) {
			if( this.validateModifier( key, 'attackBonus' ) && Modifiers[ key ].actionTypes.indexOf( this.state.configuration.actionType ) > -1 ) {
				attackBonus += Modifiers[ key ].attackBonus;
			}
		}
		if( this.state.configuration.buffSmiteEvil ) {
			attackBonus += Character.modifier.charisma;
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
		this.setState({
			attackTeaser : attacks.join( "/" )
		});
	}
	
	damageTeaser() {
		let damage = 0;
		this.state.damageRolls.map(
			( attack ) => {
				attack.map(
					( roll ) => {
						const total   = roll.split( ' ' )[ 0 ];
						const split   = total.replace( '-', '+' ).split( '+' );
						const dice    = split[ 0 ].split( 'd' );
						const flat    = split[ 1 ] && parseInt( split[ 1 ] ) != 0 ? parseInt( split[ 1 ] ) : 0;
						const diceAvg = parseInt( dice[ 0 ] ) * ( ( 1 + parseInt( dice[ 1 ] ) ) / 2 );
						damage += diceAvg + flat;
					}
				);
			}
		);
		this.setState({
			damageTeaser : Math.floor( damage )
		});
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
				arrows      : this.numberOfArrows( count ),
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
			this.attackTeaser();
			this.damageRolls();
		});
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
	
	bonusDamage( attackId ) {
		let damageBonus = Weapon.enhancementBonus;
		for( var key in this.state.configuration ) {
			if( this.validateModifier( key, 'damageBonus' ) ) {
				damageBonus += Modifiers[ key ].damageBonus;
			}
		}
		let paladinLevel = Character.paladinLevel + ( this.state.configuration.buffBracersOfTheAvengingKnight ? 4 : 0 );
		if( attackId == 0 && this.state.configuration.buffSmiteEvil && this.state.configuration.buffSmiteSubtype ) {
			damageBonus += 2 * paladinLevel;
		} else if( this.state.configuration.buffSmiteEvil ) {
			damageBonus += paladinLevel;
		}
		if( damageBonus == 0 ) {
			return '';
		} else {
			return damageBonus > 0 ? '+' + damageBonus : damageBonus;
		}
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
			let bonusDamage = this.bonusDamage( count );
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
		}, () => {
			this.damageTeaser();
			console.log( this.state.damageRolls );
		});
	}
	
	switchToPanel( panel ) {
		console.log( "switch called", panel );
		let panels = {
			configuration : false,
			attackSequence : false,
			damageRolls : false
		};
		console.log( this.state.panels );
		this.setState({
			panels : panels
		}, () => {
			console.log( this.state.panels );
			panels[ panel ] = true;
			this.setState({
				panels : panels
			}, () => {
				console.log( this.state.panels );
			});
		});
	}
	
	render() {
		return (
			<div className="app">
				<Configuration show={ this.state.panels.configuration } updateCalculator={ this.configurationUpdated } confirmConfiguration={ this.switchToPanel } attackTeaser={ this.state.attackTeaser } damageTeaser={ this.state.damageTeaser }/>
				<div className={ "attackSequence" + ( this.state.panels.attackSequence ? " show" : "" ) }>
					<ul>
						{ this.state.attackSequence.map(
							( attack ) => <Attack updateCalculator={ this.modifyAttackSequence } { ...attack } />
						) }
					</ul>
					<div className="navigate">
						<button className="back" onClick={ () => { this.switchToPanel( 'configuration' ) } }>« Back</button>
						<button className="next" onClick={ () => { this.switchToPanel( 'damageRolls' ) } }>Damage!</button>
					</div>
				</div>
				<div className={ "damageRolls" + ( this.state.panels.damageRolls ? " show" : "" ) }>
					<ul>
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
					<div className="navigate">
						<button className="back" onClick={ () => { this.switchToPanel( 'attackSequence' ) } }>« Back</button>
						<button className="next" onClick={ () => { this.switchToPanel( 'configuration' ) } }>Reconfigure!</button>
					</div>
				</div>
			</div>
		);
	}
};
