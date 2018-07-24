import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';

const configureStore = (initialState={}) => {
	let middleware = applyMiddleware(thunk);
  
	if (process.env.NODE_ENV !== 'production') {
		// configure redux-devtools-extension
		// @see https://github.com/zalmoxisus/redux-devtools-extension
		const devToolsExtension = window.devToolsExtension;
		if (typeof devToolsExtension === 'function') {
			middleware = compose(middleware, devToolsExtension());
		}
	}

	const store = createStore(
		rootReducer,
		initialState,
		middleware
	);
  
	// Enable Webpack hot module replacement for reducers
	if (module.hot) {
		module.hot.accept('./reducers/rootReducer', () => {
			store.replaceReducer(require('./reducers/rootReducer').default);
		});
	}

	return store;
}

export default configureStore;
