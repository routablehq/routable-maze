import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import useMaze from './state/maze';
import Field from "./components/Field"
import Hedges from "./components/Hedges"
import Character from "./components/Character"
import GlobalStyles from "./components/GlobalStyles"


import './App.css';

const socket = io('http://localhost:8080');

function App() {

  const { x, y, maze, loaded } = useMaze();
  const [otherPlayers, setOtherPlayers] = useState({});
  // const [otherPlayers, setOtherPlayers] = useState('foo');

  useEffect(() => {
    socket.emit('client_connected', 'client connected');

    socket.on('server_connected', (payload) => {
      console.log('server connected', payload);
    });

    socket.on('new_player_location', ({ id, x, y }) => {
      console.log(`player ${id}: ${x} ${y}`);
      setOtherPlayers(prev => ({ ...prev, [id]: { x, y } }));
    });
  }, []);

  useEffect(() => {
    socket.emit('location_change', { x, y });
  }, [x, y]);

  console.log('component:', otherPlayers);
  return (
    <div className="app">
      <GlobalStyles />
      <h1 className="title">A-maze'in Routable</h1>
      {/* <div>{otherPlayers}</div> */}
      {loaded && (
        <Field width={30} height={30}>
          <Hedges maze={maze} width={30} height={30} />
          <Character x={x} y={y} />
          {Object.keys(otherPlayers).map(key => {
            const { x: i, y: j }  = otherPlayers[key];
            return <Character x={i} y={j} key={key} />;
          })}
        </Field>
      )}
    </div>
  );
}

export default App;
