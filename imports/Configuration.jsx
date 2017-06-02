import React, { Component } from 'react';

export default class Configuration extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			actionType                     : 'fullAttack',
			featRapidShot                  : true,
			featDeadlyAim                  : true,
			buffShockingBurst              : true,
			buffBracersOfTheAvengingKnight : true
		};
		this.handleChange = this.handleChange.bind( this );
		this.handleSubmit = this.handleSubmit.bind( this );
		this.confirmConfiguration = this.confirmConfiguration.bind( this );
	}
	
	componentWillMount() {
		this.props.updateCalculator( this.state );
	}
	
	handleChange( event ) {
		const target = event.target;
		const value  = target.type === 'checkbox' ? target.checked : target.value;
		const id     = target.id;
		this.setState({
			[ id ] : value
		}, () => {
			this.props.updateCalculator( this.state );
		});
	}
	
	handleSubmit( event ) {
		event.preventDefault();
	}
	
	confirmConfiguration() {
		this.props.confirmConfiguration( 'attackSequence' );
	}
	
	render() {
		return (
			<div className={ "configuration" + ( this.props.hide ? " hide" : "" ) }>
				<div className="teaser">
					<div className="attackTeaser">{ this.props.attackTeaser } <small>ATK</small></div>
					<div className="damageTeaser">{ this.props.damageTeaser } <small>DMG</small></div>
				</div>
				<form onSubmit={ this.handleSubmit }>
					<h3>Action</h3>
					<div className="actionType">
						<ul>
							<li>
								<select onChange={ this.handleChange } value={ this.state.actionType } id="actionType">
									<option value="standard">Standard</option>
									<option value="fullAttack">Full Attack</option>
								</select>
							</li>
						</ul>
					</div>
					<h3>Feats</h3>
					<ul className="feats">
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.featDeadlyAim || false } id="featDeadlyAim" /><label htmlFor="featDeadlyAim">Deadly Aim</label></li>
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.featRapidShot || false } id="featRapidShot" /><label htmlFor="featRapidShot">Rapid Shot</label></li>
					</ul>
					<h3>Buffs</h3>
					<ul className="buffs">
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.buffBless || false } id="buffBless" /><label htmlFor="buffBless">Bless</label></li>
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.buffBlessWeapon || false } id="buffBlessWeapon" /><label htmlFor="buffBlessWeapon">Bless Weapon</label></li>
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.buffBlessingOfFervor || false } id="buffBlessingOfFervor" /><label htmlFor="buffBlessingOfFervor">Blessing of Fervor: Attack</label></li>
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.buffHaste || false } id="buffHaste" /><label htmlFor="buffHaste">Blessing of Fervor: Haste</label></li>
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.buffDaybreakArrow || false } id="buffDaybreakArrow" /><label htmlFor="buffDaybreakArrow">Daybreak Arrow</label></li>
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.buffGravityBow || false } id="buffGravityBow" /><label htmlFor="buffGravityBow">Gravity Bow</label></li>
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.buffFlamingBurst || false } id="buffFlamingBurst" /><label htmlFor="buffFlamingBurst">Flaming Burst</label></li>
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.buffLitanyOfRighteousnous || false } id="buffLitanyOfRighteousnous" /><label htmlFor="buffLitanyOfRighteousnous">Litany of Righteousness</label></li>
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.buffShockingBurst || false } id="buffShockingBurst" /><label htmlFor="buffShockingBurst">Shocking Burst</label></li>
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.buffSmiteEvil || false } id="buffSmiteEvil" /><label htmlFor="buffSmiteEvil">Smite Evil</label></li>
					</ul>
					<h3>Target</h3>
					<ul className="target">
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.targetIsEvil || false } id="targetIsEvil" /><label htmlFor="targetIsEvil">Is evil</label></li>
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.targetIsSmiteSubtype || false } id="targetIsSmiteSubtype" /><label htmlFor="targetIsSmiteSubtype">Is outsider, dragon or undead</label></li>
					</ul>
					<h3>Equipment</h3>
					<ul className="equipment">
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.buffBracersOfTheAvengingKnight || false } id="buffBracersOfTheAvengingKnight" /><label htmlFor="buffBracersOfTheAvengingKnight">Bracers Of The Avenging Knight</label></li>
					</ul>
				</form>
				<button onClick={ () => { this.confirmConfiguration(); } }>Attack →</button>
			</div>
		);
	}
};
