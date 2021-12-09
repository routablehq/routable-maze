import React from 'react';
import io from 'socket.io-client';

import useMaze from './state/maze';
import Field from "./components/Field"
import Hedges from "./components/Hedges"
import Character from "./components/Character"
import GlobalStyles from "./components/GlobalStyles"


import './App.css';

const socket = io('http://localhost:8080');

function App() {
  socket.emit('client connected', 'client connected');
  
  socket.on('server connected', (payload) => {
    console.log('server connected', payload);
  });
  
  const { x, y, maze, loaded } = useMaze()
  
  return (
    <div className="app">
      <GlobalStyles />
      <h1 className="title">A-maze'in Routable</h1>
      {loaded && (
        <Field width={30} height={30}>
          <Hedges maze={maze} width={30} height={30} />
          <Character x={x} y={y} />
        </Field>
      )}
    </div>
  );
}

export default App;
