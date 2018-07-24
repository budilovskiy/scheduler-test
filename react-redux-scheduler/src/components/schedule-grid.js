import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import './schedule-grid.css';
import XAxis from './x-axis';

const dayLength = 1440;
const hourLength = 60;

class ScheduleGrid extends PureComponent {
	constructor(props) {
		super(props);
		const selection = props.data.map(row => ({
			key: row.key,
			value: row.value.slice()
		}));
		this.state = {
			clearBtnActive: this.isClear(selection),
			saveBtnActive: false,
			mouseDown: false,
			start: null,
			selection
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.data !== this.props.data && this.state.saveBtnActive) {
			this.setState({ saveBtnActive: false });
		}
	}

	isClear = selection => selection.some(row => row.value.length !== 0);

	isRowAllDay = row => {
		const { value } = row;
		let res = false;
		if (value && value.length === 1) {
			const { bt, et } = value[0];
			if (bt === 0 && et === dayLength - 1) {
				res = true;
			}
		}
		return res;
	};

	clearRow = (rowIndex, callback) => {
		const newSelection = this.state.selection.slice();
		newSelection[rowIndex].value = [];
		this.setState({ selection: newSelection }, callback ? callback() : null);
	};

	calculateSelection = (rowIndex, newRange) => {
		const { selection } = this.state;
		const ranges = selection[rowIndex].value.slice();

		const mergeRanges = ranges => {
			const sorted = ranges.sort((a, b) => a.bt - b.bt);
			let et = 0;
			const result = sorted.reduce((newCollection, range, index) => {
				if (et < range.bt || index === 0) {
					newCollection.push(range);
				} else {
					if (range.et > et) {
						newCollection[newCollection.length - 1].et = range.et;
					}
				}
				et = range.et + 1;
				return newCollection;
			}, []);
			return result;
		};

		const newSelection = selection.slice();
		newSelection[rowIndex].value = mergeRanges([...ranges, newRange]);

		return newSelection;
	};

	onMouseDown = (event, rowIndex, cellIndex) => {
		event.preventDefault();
		const newRange = {
			bt: cellIndex,
			et: cellIndex + hourLength - 1
		};
		this.setState({
			mouseDown: true,
			start: {
				rowIndex,
				cellIndex
			},
			selection: this.calculateSelection(rowIndex, newRange),
			clearBtnActive: true,
			saveBtnActive: true
		});
		window.document.addEventListener('mouseup', this.onMouseUp);
	};

	onMouseMove = (event, cellIndex) => {
		event.preventDefault();
		const { mouseDown, start } = this.state;
		if (mouseDown) {
			const newRange = {
				bt: cellIndex,
				et: cellIndex + hourLength - 1
			};
			this.setState({
				selection: this.calculateSelection(start.rowIndex, newRange),
				clearBtnActive: true,
				saveBtnActive: true
			});
		}
	};

	onMouseUp = () => {
		window.document.removeEventListener('mouseup', this.onMouseUp);
		const { mouseDown } = this.state;
		if (mouseDown) {
			this.setState({
				mouseDown: false,
				start: null
			});
		}
	};

	handleAllDayClick = rowIndex => {
		const { selection } = this.state;
		const ranges = selection[rowIndex].value;

		const setAllDay = () => {
			const newRange = {
				bt: 0,
				et: dayLength - 1
			};
			this.setState({
				selection: this.calculateSelection(rowIndex, newRange),
				clearBtnActive: true,
				saveBtnActive: true
			});
		};

		const clearDay = callback => this.clearRow(rowIndex, callback);

		if (ranges.length) {
			if (this.isRowAllDay(selection[rowIndex])) {
				clearDay(() => this.setState({ saveBtnActive: true }));
			} else {
				clearDay(setAllDay);
			}
		} else {
			setAllDay();
		}
	};

	handleClearBtn = () => {
		const { selection } = this.state;
		selection.forEach((row, index) =>
			this.clearRow(index, () =>
				this.setState({
					clearBtnActive: this.isClear(selection),
					saveBtnActive: true
				})
			)
		);
	};

	handleSaveBtn = () => {
		const { onSave } = this.props;
		const { selection } = this.state;
		if (onSave) {
			onSave(selection);
			// this.setState({
			// 	saveBtnActive: false
			// });
		}
	};

	renderRow = (row, rowIndex) => {
		const isCellSelected = (row, cellIndex) => {
			let res = false;
			row.value.forEach(range => {
				if (cellIndex >= range.bt && cellIndex < range.et) {
					res = true;
				}
			});
			return res;
		};

		const cells = [];

		cells.push(
			<div
				key="day-col"
				className="Grid-cell"
				style={{
					color: row.value && row.value.length ? '#999999' : '#cccccc',
					backgroundColor: row.value && row.value.length ? '#dddddd' : '#eeeeee'
				}}>
				{row.key}
			</div>
		);

		cells.push(
			<div
				key="all-day-col"
				className="Grid-all-day-cell"
				onClick={() => this.handleAllDayClick(rowIndex)}>
				{this.isRowAllDay(row) && (
					<input
						type="checkbox"
						className="Grid-checkbox"
						checked={true}
						onChange={() => {}}
					/>
				)}
			</div>
		);

		for (let i = 0; i < dayLength; i = i + hourLength) {
			cells.push(
				<div
					key={`cell-${i}`}
					className="Grid-cell"
					style={{
						backgroundColor: isCellSelected(row, i) ? '#dddddd' : '#ffffff'
					}}
					onMouseDown={e => this.onMouseDown(e, rowIndex, i)}
					onMouseMove={e => this.onMouseMove(e, i)}
				/>
			);
		}

		return cells;
	};

	render() {
		const { selection } = this.state;
		const { clearBtnActive, saveBtnActive } = this.state;

		const rows = [
			<XAxis key="x-axis" dayLength={dayLength} hourLength={hourLength} />
		];

		selection.forEach((row, index) => {
			rows.push(
				<div key={row.key} className="Grid-row">
					{this.renderRow(row, index)}
				</div>
			);
		});

		return (
			<div className="Grid">
				{rows}
				<div className="Grid-buttons-container">
					<button
						className="Grid-button"
						onClick={this.handleClearBtn}
						style={{ background: clearBtnActive ? '#999999' : '#cccccc' }}>
						Clear
					</button>
					<button
						className="Grid-button"
						onClick={this.handleSaveBtn}
						style={{ background: saveBtnActive ? '#999999' : '#cccccc' }}>
						Save changes
					</button>
				</div>
			</div>
		);
	}
}

ScheduleGrid.propTypes = {
	data: PropTypes.array,
	onSave: PropTypes.func
};

export default ScheduleGrid;
