const Legend = ({playerName, otherPlayers, unregister}) => {
  const otherPlayersList = otherPlayers.map((opName) => <li>{opName}</li>);
  return (
    <div className="legend">
      <h2>Legend</h2>
      <ul>
        <li>{playerName} - <a onClick={unregister}>unregister</a> </li>
        {otherPlayersList}
      </ul>
    </div>
  )
}

export default Legend;
