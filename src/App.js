import React, { useEffect, useState } from 'react';

import './App.css';
import protobuf from 'protobufjs';
import { Buffer } from 'buffer';

function App() {
  const [price, setPrice] = useState('');

  useEffect(() => {
    const ws = new WebSocket('wss://streamer.finance.yahoo.com');
    const root = protobuf.load('./yaticker.proto', (error, root) => {
      const Yaticker = root.lookupType('yaticker');

      ws.onopen = () => {
        // on connecting, do nothing but log it to the console
        console.log('connected');

        ws.send(
          JSON.stringify({
            subscribe: ['EURUSD=X'],
          })
        );
      };

      ws.onmessage = (message) => {
        setPrice(Yaticker.decode(new Buffer(message.data, 'base64')));
      };
    });
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Exchange : {price && price.exchange}</h1>
        <h1>Symbol : {price && price.id}</h1>
        <h1>
          Price : {price && price.price.toFixed(2)}{' '}
          {price && price.change.toFixed(4)} (
          {price && price.changePercent.toFixed(4)})
        </h1>
      </header>
    </div>
  );
}

export default App;
