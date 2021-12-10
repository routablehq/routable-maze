const Legend = ({playerName, color, otherPlayers, unregister}) => {
  const otherPlayersList = (Object.keys(otherPlayers).length === 0) ? "" :
    Object.keys(otherPlayers).map((key) => <li style={{color: "#" + otherPlayers[key]['color']}}>{otherPlayers[key]['name']}</li>);
  return (
    <div className="legend">
      <h2>Legend</h2>
      <ul style={{background: "#ddd"}}>
        <li style={{color: "#" + color}}>{playerName} - <button onClick={unregister}>unregister</button></li>
        {otherPlayersList}
      </ul>
    </div>
  )
}

export default Legend;
