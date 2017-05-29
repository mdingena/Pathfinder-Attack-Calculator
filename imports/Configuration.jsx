import React, { Component } from 'react';

export default class Configuration extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			actionType : 'fullAttack'
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
			<form className="configuration" onSubmit={ this.handleSubmit }>
				<select onChange={ this.handleChange } value={ this.state.actionType } id="actionType">
					<option value="standard">Standard</option>
					<option value="fullAttack">Full Attack</option>
				</select>
				<div className="feats">
					<h3>Feats</h3>
					<input type="checkbox" onChange={ this.handleChange } checked={ this.state.featRapidShot || false } id="featRapidShot" /><label htmlFor="featRapidShot">Rapid Shot</label>
					<input type="checkbox" onChange={ this.handleChange } checked={ this.state.featDeadlyAim || false } id="featDeadlyAim" /><label htmlFor="featDeadlyAim">Deadly Aim</label>
				</div>
				<div className="buffs">
					<h3>Buffs</h3>
					<input type="checkbox" onChange={ this.handleChange } checked={ this.state.buffGravityBow || false } id="buffGravityBow" /><label htmlFor="buffGravityBow">Gravity Bow</label>
					<input type="checkbox" onChange={ this.handleChange } checked={ this.state.buffFlamingBurst || false } id="buffFlamingBurst" /><label htmlFor="buffFlamingBurst">Flaming Burst</label>
				</div>
				<input type="submit" value="Attack" />
			</form>
		);
	}
};
