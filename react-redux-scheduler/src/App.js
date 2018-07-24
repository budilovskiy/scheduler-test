import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import ScheduleGrid from './components/schedule-grid';
import { getData, sendData } from './core/actions/calendarActions';

class App extends Component {
	constructor(props) {
		super(props);
		props.getData();
	}

	onSave = data => this.props.sendData(data);

	render() {
		const { loading, error, data } = this.props;

		if (loading) {
			return (
				<div className="App">
					<div className="App-spinner-container">
						<div className="App-spinner" />
					</div>
				</div>
			);
		}

		if (error) {
			return (
				<div className="App">
					<h1 className="App-header">ERROR: {error}</h1>
				</div>
			);
		}

		return (
			<div className="App">
				<header className="App-header">
					<h1 className="App-title">Set schedule</h1>
				</header>
				<ScheduleGrid data={data} onSave={this.onSave} />
			</div>
		);
	}
}

const mapStateToProps = state => ({
	data: state.calendar.data,
	loading: state.calendar.loading,
	error: state.calendar.error,
});

const mapDispatchToProps = {
	getData,
	sendData
};

App.propTypes = {
	data: PropTypes.array,
	error: PropTypes.object,
	getData: PropTypes.func.isRequired,
	loading: PropTypes.bool,
	sendData: PropTypes.func.isRequired
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
