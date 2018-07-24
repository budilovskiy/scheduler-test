import PropTypes from 'prop-types';
import React from 'react';
import './x-axis.css';

const XAxis = props => {
	const { dayLength, hourLength } = props;
	const cells = [];
	cells.push(<div key="empty" className="Grid-axis-cell" />);
	cells.push(
		<div key="all-day" className="Grid-axis-cell">
			All day
		</div>
	);
	for (let i = 0; i < dayLength; i = i + hourLength) {
		if (i % (hourLength * 3) === 0) {
			let stringHour = String(i / hourLength);
			stringHour =
				stringHour.length < 2 ? '0' + stringHour + ':00' : stringHour + ':00';
			cells.push(
				<div key={`axis-cell-${i}`} className="Grid-axis-hour-cell">
					<div className="Grid-axis-hour-text">{stringHour}</div>
					<div className="Grid-axis-hour-cell-mark" />
				</div>
			);
		}
	}
	return (
		<div key="x-axis-row" className="Grid-axis-row">
			{cells}
		</div>
	);
};

XAxis.propTypes = {
	dayLength: PropTypes.number,
	hourLength: PropTypes.number
};

XAxis.defaultProps = {
	dayLength: 1440,
	hourLength: 60
};

export default XAxis;
