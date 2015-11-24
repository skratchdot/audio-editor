import React, { Component } from 'react';
import { Link } from 'react-router';
import { Row, Col, Nav } from 'react-bootstrap';
import { connect } from 'react-redux';
const packageInfo = require('../../package.json');

class Header extends Component {
	isLinkActive(pathname) {
		return this.context.history.isActive(pathname) ? 'active' : '';
	}
	render() {
		const { counter } = this.props;
		return (
			<header>
				<Row className="header">
					<Col md={6}>
						<Link to={`/${packageInfo.name}`}>
							<h1 className="title">
								wave-editor
								&nbsp;
								<small>version {packageInfo.version}</small>
							</h1>
						</Link>
					</Col>
					<Col md={6}>
						<Nav bsStyle="pills">
							<li key="home" className={
									this.isLinkActive(`/${packageInfo.name}`) +
									this.isLinkActive(`/${packageInfo.name}/home`)}>
								<Link to={`/${packageInfo.name}`}>Home</Link>
							</li>
							<li key="about" className={this.isLinkActive(`/${packageInfo.name}/about`)}>
								<Link to={`/${packageInfo.name}/about`}>About</Link>
							</li>
							<li key="counter" className={this.isLinkActive(`/${packageInfo.name}/counter`)}>
								<Link to={`/${packageInfo.name}/counter`}>Counter</Link>
							</li>
							<li key="echo" className={this.isLinkActive(`/${packageInfo.name}/echo/${this.props.pageParams.echo}`)}>
								<Link to={`/${packageInfo.name}/echo`}>Echo</Link>
							</li>
						</Nav>
					</Col>
				</Row>
				<Row>
					<Col md={12}><div className="main-seperator"></div></Col>
				</Row>
				<Row>
					<Col md={12}>
						Redux Counter: {counter}
					</Col>
				</Row>
				<Row>
					<Col md={12}><div className="main-seperator"></div></Col>
				</Row>
			</header>
		);
	}
}

Header.contextTypes = {
	history: React.PropTypes.object
};

export default connect(function (state) {
  return {
    counter: state.counter
  };
})(Header);
