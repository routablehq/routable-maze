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
import Fireworks from './components/Fireworks';

console.log('-window', window.location);
const isProd = window.location.href.includes('maze.app');
const URL = isProd ? 'https://maze.app.megabox.dev:3380' : 'http://localhost:3380'
const socket = io(URL);

function App() {

  const [w, h] = [40, 40];

  const [identified, setIdentified] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [otherPlayers, setOtherPlayers] = useState({});
  const [seed, setSeed] = useState();
  const [playerId, setPlayerId] = useState("");
  const [color, setColor] = useState("e2a477");
  const { x, y, maze, loaded, won } = useMaze(w, h, seed);


  useEffect(() => {
    socket.emit('client_connected', 'client connected');

    socket.on('server_connected', (payload) => {
      console.log('server connected', payload);
    });

    socket.on('new_player_location', ({ id, name, color, x, y }) => {
      console.log(`player ${name} ${color} (${id}): ${x} ${y}`);
      setOtherPlayers(prev => ({ ...prev, [id]: { x, y, name, color } }));
    });

    socket.on('player_left', ({id}) => {
      delete otherPlayers[id];
      setOtherPlayers(otherPlayers);
    });
  }, []);

  useEffect(() => {
    socket.emit('location_change', { x, y, id: playerId });
  }, [x, y]);

  useEffect(() => {
    socket.emit('player_unregistered', { id: playerId });
  }, [playerName]);

  function consumeIdentity({seed, id, playerName, color}) {
    setSeed(seed);
    setPlayerId(id);
    setPlayerName(playerName);
    setColor(color);
    setIdentified(true);
  }

  function setIdentity(name) {
    playerService.register(name).then((data) => {
      consumeIdentity(data);
    });
  }

  function clearIdentity() {
    playerService.unregister(playerId);
    setPlayerName(null);
    setIdentified(false);
    setOtherPlayers({});
  }

  if (won) {
    return <Fireworks/>;
  }

  return (
    <div className="app">
      <GlobalStyles />
      <h1 className="title">A-maze'in Routable</h1>
      {!identified && <Identify setIdentity={setIdentity} />}
      {identified && loaded && (
        <div className="game-container">
          <Legend playerName={playerName} color={color} otherPlayers={otherPlayers} unregister={clearIdentity}/>
          <Field width={w} height={h}>
            <Hedges maze={maze} width={w} height={h} />
            <Character clr={color} x={x} y={y} />
            {Object.keys(otherPlayers).map(key => {
              const { x: i, y: j, color: playerColor}  = otherPlayers[key];
              return <Character x={i} y={j} clr={playerColor} key={key} />;
            })}
          </Field>
        </div>
      )}
    </div>
  );
}

export default App;
