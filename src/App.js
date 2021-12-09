import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import useMaze from './state/maze';
import Field from "./components/Field"
import Hedges from "./components/Hedges"
import Character from "./components/Character"
import GlobalStyles from "./components/GlobalStyles"


import './App.css';
import Identify from './components/Identify';
import Legend from './components/Legend';
import { playerService } from './services'

const socket = io('http://localhost:8080');

function App() {
  socket.emit('client connected', 'client connected');
  
  socket.on('server connected', (payload) => {
    console.log('server connected', payload);
  });

  const [identified, setIdentified] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [otherPlayers, setOtherPlayers] = useState(["OP 2", "OP 3", "OP 4", "OP 5"]);
  const [seed, setSeed] = useState();

  const [w, h] = [40, 40];

  function consumeIdentity(data) {
    setSeed(data.seed);
    setPlayerName(data.playerName);
    setIdentified(true);
  }

  function setIdentity(name) {
    playerService.register(name).then((data) => {
      consumeIdentity(data);
    });
  }

  function clearIdentity() {
    playerService.unregister();
    setPlayerName(null);
    setIdentified(false);
  }

  const { x, y, maze, loaded } = useMaze(w, h, seed);

  useEffect(() => {
    let currentPlayerData = localStorage.getItem('currentPlayerData');
    if (currentPlayerData) {
      consumeIdentity(JSON.parse(currentPlayerData));
    }
  });

  return (
    <div className="app">
      <GlobalStyles />
      <h1 className="title">A-maze'in Routable</h1>
      {!identified && <Identify setIdentity={setIdentity} />}
      {identified && loaded && (
        <div>
          <Legend playerName={playerName} otherPlayers={otherPlayers} unregister={clearIdentity}/>
          <Field width={w} height={h}>
            <Hedges maze={maze} width={w} height={h} />
            <Character x={x} y={y} />
          </Field>
        </div>
      )}
    </div>
  );
}

export default App;
