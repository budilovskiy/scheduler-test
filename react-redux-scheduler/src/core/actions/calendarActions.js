import axios from 'axios';

const url = 'http://localhost:3001/api/data';

export const GET_DATA_BEGIN = 'GET_DATA_BEGIN';
export const GET_DATA_SUCCESS = 'GET_DATA_SUCCESS';
export const GET_DATA_FAILURE = 'GET_DATA_FAILURE';
export const SEND_DATA_SUCCESS = 'SEND_DATA_SUCCESS';
export const SEND_DATA_FAILURE = 'SEND_DATA_FAILURE';

export const getData = () => {
	return dispatch => {
		dispatch(getDataBegin());
		return axios
			.get(url)
			.then(json => json.data)
			.then(data => {
				dispatch(getDataSuccess(data));
				return data;
			})
			.catch(error => dispatch(getDataFailure(error)));
	};
};

export const getDataBegin = () => ({
	type: GET_DATA_BEGIN
});

export const getDataSuccess = data => ({
	type: GET_DATA_SUCCESS,
	payload: data
});

export const getDataFailure = error => ({
	type: GET_DATA_FAILURE,
	payload: error
});

export const sendData = data => {
	return dispatch => {
		const body = data.reduce((obj, item) => {
			obj[item['key']] = item['value'];
			return obj;
		}, {});
		return axios
			.post(url, body)
			.then(response => {
				if (response.status === 200) {
					dispatch(sendDataSuccess(body));
				} else {
					dispatch(sendDataFailure('Data does not saved'));
				}
			})
			.catch(error => dispatch(sendDataFailure(error)));
	};
};

export const sendDataSuccess = data => ({
	type: SEND_DATA_SUCCESS,
	payload: data
});

export const sendDataFailure = error => ({
	type: SEND_DATA_FAILURE,
	payload: error
});
