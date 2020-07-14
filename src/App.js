import React from 'react';
import './style.css'

const num_rows = 4;
const num_columns = 4;
const group_size = 4;

function Tile(props) {
  // props.clue - string of the clue for this tile
  // props.column, props.row - 0 indexed position in the wall
  // props.selected - truthy if currently selected  (mutually exclusive with props.group)
  // props.group - 0 for first found, 1 for second ...
  //               else null if clue's group hasn't been found

  let className = "tile"
  className += ` column_${props.column} row_${props.row}`
  if (props.selected) {
    className += " selected"
  }
  let onClick
  if (props.group == null) {
    onClick = props.onClick
  }else {
    className += ` group_${props.group}`
  }
  return (
    <div className={className} onClick={onClick}>
      <div className="clue">
        {props.clue}
      </div>
    </div>
  )
}

function Wall(props) {
  // props.clueOrder - array of all clues specified left to right, top to bottom
  // props.foundGroups - array of the groups found so far, in order of discovery
  //                     each group is a Set of clues
  // props.selected - Set of selected clues
  // props.onClick - callback for when a tile is clicked, takes the clue as an argument
  const tiles = []
  for (let i = 0; i < props.clueOrder.length; i++) {
    const clue = props.clueOrder[i];

    let group = props.groundGroups.findIndex(group => group.has(clue))
    if (group === -1) group = null

    tiles.push(
      <Tile 
        clue={clue} 
        key={clue}
        selected={props.selected.has(clue)}
        group={group}
        column={i % num_columns} row={Math.floor(i / num_columns)}
        onClick={() => props.onClick(clue)}
      />)
  }
  return (
    <div className="wall">
      {tiles}
    </div>
  )
}

function set_eq(a, b) {
  if (a.size !== b.size) return false
  for (let x of a) {
    if (!b.has(x)) return false
  }
  return true
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    // this.props.clues - array of all clues (strings)
    // this.props.groups - array of groups, each is a Set of clues
    
    this.state = {
      selected: new Set(), // currently selected clues
      clueOrder: this.props.clues, // the current order of clues in the wall (left to right, top to bottom)
      foundGroups: [] // the indexes of found groups (in this.props.groups)
    }
    // TODO: shuffle initially
  }

  tileClicked(clue) {
    let newSelected = new Set(this.state.selected)

    if (this.state.selected.has(clue)) { // deselect
      // TODO: delay
      newSelected.delete(clue)
      this.setState({selected: newSelected})
      
    }else { // select
      newSelected.add(clue)
      // TODO: use async - callback
      
      if (newSelected.size < group_size) { // just add to selected
        this.setState({selected: newSelected})

      }else { // a full group guess: check if correct, handle, then clear
        for (let i = 0; i < this.props.groups.length; i++) {
          if (this.state.foundGroups.includes(i)) {
            continue
          }
          if (set_eq(newSelected, this.props.groups[i])) {
            let newFoundGroups = this.state.foundGroups.slice()
            newFoundGroups.push(i)
            this.setState({
              selected: new Set(), 
              foundGroups: newFoundGroups
            })
            // TODO: move tiles
            return
          }
        }
        // doesn't match any group: incorrect
        this.setState({selected: new Set()})
        // TODO: callback for life update
      }
    }
  }

  render() {
    let foundGroups = this.state.foundGroups.map(i => this.props.groups[i])
    return (
      <Wall 
        clueOrder={this.state.clueOrder} 
        selected={this.state.selected}
        foundGroups={foundGroups}
        onClick={clue => this.tileClicked(clue)} />
    )
  }
}


function App() {
  const clues = [
    "alpha", "beta", "gamma", "delta", 
    "epsilon", "zeta", "eta", "theta", 
    "iota", "kappa", "lambda", "mu", 
    "nu", "xi", "omikron", "pi"]
  const groups = [
    new Set(["alpha", "beta", "gamma", "delta"]), 
    new Set(["epsilon", "zeta", "eta", "theta"]), 
    new Set(["iota", "kappa", "lambda", "mu"]), 
    new Set(["nu", "xi", "omikron", "pi"])]
  // TODO: just take groups & build clues from there
  return <Game clues={clues} groups={groups}/>
}

export default App;
