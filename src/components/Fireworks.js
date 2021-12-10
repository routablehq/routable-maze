import { Fireworks } from 'fireworks-js/dist/react'
import reactDom from 'react-dom'

const FireworksCelebration = ({ player }) => {
  const options = {
    speed: 3
  }

  const fireworksStyle = {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'fixed',
    background: '#000'
  }

  const playerStyle = {
    color: 'red',
  }

  return (
    <Fireworks options={options} style={fireworksStyle}>
        <span style={playerStyle}>Player { player } won!</span>
    </Fireworks>
  );
}

export default FireworksCelebration;
