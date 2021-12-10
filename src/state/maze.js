import { useReducer, useEffect } from "react"
import generate from "generate-maze"

const { min, max } = Math

// CONSTANTS
const LOADED = "maze/LOADED"
const LEFT = "maze/LEFT"
const RIGHT = "maze/RIGHT"
const UP = "maze/UP"
const DOWN = "maze/DOWN"
const KEY_PRESS = "maze/KEY_PRESS"

// REDUCER
const reducer = (state, { type, payload }) => {
  switch (type) {
    case LOADED:
      return { ...state, loaded: true, maze: payload }
    case KEY_PRESS: {
      const cell = state.maze[state.y][state.x]
      let newState = state;

      if (payload === "ArrowLeft" && !cell.left) {
        newState = { ...state, x: max(0, state.x - 1) };
      }
      
      if (payload === "ArrowUp" && !cell.top) {
        newState = { ...state, y: max(0, state.y - 1) }
      }
      
      if (payload === "ArrowRight" && !cell.right) {
        newState = { ...state, x: min(state.maze.length, state.x + 1) }
      }
      
      
      if (payload === "ArrowDown" && !cell.bottom) {
        newState = { ...state, y: min(state.maze.length, state.y + 1) }
      }

      if (newState.x === state.maze.length - 1  && newState.y == state.maze.length - 1) {
        console.log('you fucking won');
        newState.won = true;
      }

      if (payload === 'Tab') {
        newState = { ...state, x: state.maze.length - 2, y: state.maze.length - 2};
      }
      
      return newState;
    }
    default:
      return state
  }
}

// STATE HOOK
const useMaze = (w, h, seed) => {
  const [state, dispatch] = useReducer(reducer, {
    maze: [],
    x: 0,
    y: 0,
    won: false,
  })
  useEffect(() => {
    const maze = generate(w, h, true, seed)
    const handleKeyPress = ({ key }) => dispatch({ type: KEY_PRESS, payload: key })
    dispatch({ type: LOADED, payload: maze })
    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [])
  return state
}

export default useMaze
