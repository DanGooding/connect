import React from 'react';
import './style.css'

function Tile(props) {
  let className = "tile"
  className += ` column_${props.column} row_${props.row}`
  if (props.selected) {
    className += " selected"
  }
  return (
    <div className={className} onClick={props.onClick}>
      <div className="clue">
        {props.clue}
      </div>
    </div>
  )
}

function Wall(props) {
  const tiles = []
  for (let i = 0; i < props.clueOrder.length; i++) { // TODO: need a key on each ?
    const clue = props.clueOrder[i];
    tiles.push(
      <Tile 
        clue={clue} 
        key={clue}
        selected={props.selected.has(clue)}
        column={i % 4} row={Math.floor(i / 4)}
        onClick={() => props.onClick(clue)}
      />)
  }
  return (
    <div className="wall">
      {tiles}
    </div>
  )
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    // this.props.clues - array of all clues (strings)
    // this.props.groups - array of groups, each is an array of clues
    
    this.state = {
      selected: new Set(), // the selected clues
      clueOrder: this.props.clues, // the current order of clues in the wall 
      // TODO: shuffle initially
    }
  }

  tileClicked(clue) {
    
    if (this.state.selected.has(clue)) {
      let newSelected = new Set(this.state.selected)
      newSelected.delete(clue)
      this.setState({selected: newSelected})
      
    }else {
      let newSelected = new Set(this.state.selected)
      newSelected.add(clue)
      this.setState({selected: newSelected})
      // TODO: use async - callback

      if (newSelected.size === 4) {
        // check for group
      }
    }
  }

  render() {
    return (
      <Wall 
        clueOrder={this.state.clueOrder} 
        selected={this.state.selected}
        onClick={(clue) => this.tileClicked(clue)} />
    )// TODO: also take selected
  }
}


function App() {
  const clues = [
    "alpha", "beta", "gamma", "delta", 
    "epsilon", "zeta", "eta", "theta", 
    "iota", "kappa", "lambda", "mu", 
    "nu", "xi", "omikron", "pi"]
  const groups = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15]]
  
  return <Game clues={clues} groups={groups}/>
}

export default App;
