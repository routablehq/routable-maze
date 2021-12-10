import React from "react"
import styled from "styled-components"

const { min } = Math

const Character = ({ x, y, className, clr }) => {
  return (
    <div className={className} style={{ background: "#" + clr, gridColumn: min(x + 1, 40), gridRow: min(y + 1, 40) }} />
  )
}

const StyledCharacter = styled(Character)`
  margin: 2px;
  border-radius: 2px;
`

export default StyledCharacter
