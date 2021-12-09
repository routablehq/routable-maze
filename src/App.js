import React, { useState } from 'react';
import io from 'socket.io-client';

import useMaze from './state/maze';
import Field from "./components/Field"
import Hedges from "./components/Hedges"
import Character from "./components/Character"
import GlobalStyles from "./components/GlobalStyles"


import './App.css';
import Identify from './components/Identify';
import Legend from './components/Legend';

const socket = io('http://localhost:8080');

function App() {
  socket.emit('client connected', 'client connected');
  
  socket.on('server connected', (payload) => {
    console.log('server connected', payload);
  });

  const [identified, setIdentified] = useState(false);
  const [playerName, setPlayerName] = useState("");

  function setIdentity(name) {
    setPlayerName(name);
    setIdentified(true);
  }

  const [w, h] = [40, 40];
  const seed = 123456;
  const { x, y, maze, loaded } = useMaze(w, h, seed)
  
  return (
    <div className="app">
      <GlobalStyles />
      <h1 className="title">A-maze'in Routable</h1>
      {!identified && <Identify setIdentity={setIdentity} />}
      {identified && (
        <Legend playerName={playerName}/>
      )}
      {identified && loaded && (
        <Field width={w} height={h}>
          <Hedges maze={maze} width={w} height={h} />
          <Character x={x} y={y} />
        </Field>
      )}
    </div>
  );
}

export default App;
