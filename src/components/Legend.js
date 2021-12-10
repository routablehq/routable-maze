const Legend = ({playerName, otherPlayers, unregister}) => {
  const otherPlayersList = (Object.keys(otherPlayers).length === 0) ? "" :
    Object.keys(otherPlayers).map((key) => <li>{otherPlayers[key]['name']}</li>);
  return (
    <div className="legend">
      <h2>Legend</h2>
      <ul>
        <li>{playerName} - <button onClick={unregister}>unregister</button> </li>
        {otherPlayersList}
      </ul>
    </div>
  )
}

export default Legend;
