import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

function Popup() {
  return <App />;
}

ReactDOM.render(<Popup />, document.getElementById('root'));