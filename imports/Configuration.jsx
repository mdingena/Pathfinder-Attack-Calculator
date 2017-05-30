import React, { Component } from 'react';

export default class Configuration extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			actionType : 'fullAttack',
			buffShockingBurst : true,
			buffBracersOfTheAvengingKnight : true
		};
		this.handleChange = this.handleChange.bind( this );
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
	
	handleSubmit() {
		
	}
	
	render() {
		return (
			<div className="configuration">
				<form onSubmit={ this.handleSubmit }>
					<h3>Action</h3>
					<select onChange={ this.handleChange } value={ this.state.actionType } id="actionType">
						<option value="standard">Standard</option>
						<option value="fullAttack">Full Attack</option>
					</select>
					<h3>Feats</h3>
					<ul className="feats">
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.featRapidShot || false } id="featRapidShot" /><label htmlFor="featRapidShot">Rapid Shot</label></li>
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.featDeadlyAim || false } id="featDeadlyAim" /><label htmlFor="featDeadlyAim">Deadly Aim</label></li>
					</ul>
					<h3>Buffs</h3>
					<ul className="buffs">
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.buffGravityBow || false } id="buffGravityBow" /><label htmlFor="buffGravityBow">Gravity Bow</label></li>
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.buffShockingBurst || false } id="buffShockingBurst" /><label htmlFor="buffShockingBurst">Shocking Burst</label></li>
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.buffFlamingBurst || false } id="buffFlamingBurst" /><label htmlFor="buffFlamingBurst">Flaming Burst</label></li>
					</ul>
					<h3>Smite Target</h3>
					<ul className="smite">
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.buffSmiteEvil || false } id="buffSmiteEvil" /><label htmlFor="buffSmiteEvil">Is evil</label></li>
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.buffSmiteSubtype || false } id="buffSmiteSubtype" /><label htmlFor="buffSmiteSubtype">Is outsider, dragon or undead</label></li>
					</ul>
					<h3>Equipment</h3>
					<ul className="equipment">
						<li><input type="checkbox" onChange={ this.handleChange } checked={ this.state.buffBracersOfTheAvengingKnight || false } id="buffBracersOfTheAvengingKnight" /><label htmlFor="buffBracersOfTheAvengingKnight">Bracers Of The Avenging Knight</label></li>
					</ul>
					<button type="submit">Attack!</button>
				</form>
			</div>
		);
	}
};
