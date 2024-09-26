import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './components/App';

const Popup = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(<Popup />, document.getElementById('root'));