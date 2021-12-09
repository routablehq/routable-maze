const Legend = ({playerName, otherPlayers}) => {
  const otherPlayersList = otherPlayers.map((opName) => <li>{opName}</li>);
  return (
    <div className="legend">
      <h2>Legend</h2>
      <ul>
        <li>{playerName}</li>
        {otherPlayersList}
      </ul>
    </div>
  )
}

export default Legend;
