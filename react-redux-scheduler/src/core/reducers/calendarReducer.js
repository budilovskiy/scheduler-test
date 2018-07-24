import {
	GET_DATA_BEGIN,
	GET_DATA_SUCCESS,
	GET_DATA_FAILURE,
	SEND_DATA_SUCCESS,
	SEND_DATA_FAILURE
} from '../actions/calendarActions';

const initialState = {
	data: [
		{
			key: 'mo',
			value: []
		},
		{
			key: 'tu',
			value: []
		},
		{
			key: 'we',
			value: []
		},
		{
			key: 'th',
			value: []
		},
		{
			key: 'fr',
			value: []
		},
		{
			key: 'sa',
			value: []
		},
		{
			key: 'su',
			value: []
		}
	],
	loading: false,
	error: null
};

const dataToArray = data => Object.entries(data).map(([key, value]) => ({ key, value }));

const calendarReducer = (state = initialState, action) => {
	switch (action.type) {
	case GET_DATA_BEGIN:
		return {
			...state,
			loading: true,
			error: null
		};

	case GET_DATA_SUCCESS:
		return {
			...state,
			loading: false,
			data: dataToArray(action.payload)
		};

	case GET_DATA_FAILURE:
		return {
			...state,
			loading: false,
			error: 'Get data failure',
			data: initialState.data
		};

	case SEND_DATA_SUCCESS:
		return {
			...state,
			data: dataToArray(action.payload)
		};

	case SEND_DATA_FAILURE:
		return {
			...state,
			error: 'Send data failure'
		};

	default:
		return state;
	}
};

export default calendarReducer;
