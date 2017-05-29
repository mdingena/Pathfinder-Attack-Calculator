import React, { Component } from 'react';

export default class Attack extends Component {
	render() {
		return (
			<li>+{ this.props.attackBonus }</li>
		);
	}
};
