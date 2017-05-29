import React, { Component } from 'react';

export default class Attack extends Component {
	constructor( props ) {
		super( props );
		this.handleChange = this.handleChange.bind( this );
	}
	
	handleChange( event ) {
		const target = event.target;
		const value  = target.value;
		this.props.updateCalculator( this.props.id, value );
	}
	
	render() {
		return (
			<li>
				{ this.props.attackBonus >= 0 ? "+" + this.props.attackBonus : this.props.attackBonus }
				<form>
					<input type="radio" onChange={ this.handleChange } name="result" value="miss" checked={ this.props.result == 'miss' } id={ 'miss-' + this.props.id } /><label htmlFor={ 'miss-' + this.props.id }>Miss</label>
					<input type="radio" onChange={ this.handleChange } name="result" value="hit"  checked={ this.props.result == 'hit' }  id={ 'hit-' + this.props.id } /><label htmlFor={ 'hit-' + this.props.id }>Hit</label>
					<input type="radio" onChange={ this.handleChange } name="result" value="crit" checked={ this.props.result == 'crit' } id={ 'crit-' + this.props.id } /><label htmlFor={ 'crit-' + this.props.id }>Crit</label>
				</form>
			</li>
		);
	}
};
