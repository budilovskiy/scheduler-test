import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
// import registerServiceWorker from './registerServiceWorker';
import configureStore from './core/store';

ReactDOM.render(
	<Provider store={configureStore()}>
		<App />
	</Provider>,
	document.getElementById('root')
);
// registerServiceWorker();
