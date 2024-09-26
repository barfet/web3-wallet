import React from 'react';
import ReactDOM from 'react-dom';

const Popup: React.FC = () => {
  return (
    <div>
      <h1>Web3 Wallet Extension</h1>
      <p>Welcome to your Web3 wallet!</p>
    </div>
  );
};

ReactDOM.render(<Popup />, document.getElementById('root'));