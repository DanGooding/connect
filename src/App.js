import React from 'react';
import './style.css'

const num_columns = 4
const num_rows = 4
const group_size = num_rows
const num_groups = num_columns
const maxLives = 3

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
      <div className="clue noselect">
        {props.clue}
      </div>
    </div>
  )
}

function Wall(props) {
  // props.clues - array of all clues, in the order they appear in the DOM
  //               this is fixed even when props.clueOrder changes, so the css transitions work correctly
  // props.clueOrder - array of all clues specified left to right, top to bottom
  // props.foundGroups - array of the groups found so far, in order of discovery
  //                     each group is a Set of clues
  // props.selected - Set of selected clues
  // props.onClick - callback for when a tile is clicked, takes the clue as an argument
  const tiles = []
  for (const clue of props.clues) {
    const i = props.clueOrder.indexOf(clue);

    let group = props.foundGroups.findIndex(group => group.has(clue))
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

function HealthBar(props) {
  // props.lives - number of remaining lives
  // props.maxLives - ...
  let lives = []
  for (let i = 0; i < props.maxLives; i++) {
    if (i < props.lives) {
      lives.push(<span key={i} aria-label="life" role="img">💙</span>)
    }else {
      lives.push(<span key={i} aria-label="lost life" role="img">🤍</span>)
    }
  }
  return <div className="health-bar">{lives}</div>
}

function setEq(a, b) {
  // are these Sets equal?
  if (a.size !== b.size) return false
  for (let x of a) {
    if (!b.has(x)) return false
  }
  return true
}

function randomInt(min, max) {
  // return a random integer in [min, max)
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function shuffle(a) {
  for (let i = 0; i < a.length; i++) {
    const j = randomInt(i, a.length);
    [a[i], a[j]] = [a[j], a[i]]
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    // this.props.clues - array of all clues (strings)
    // this.props.groups - array of groups, each is a Set of clues
    
    let clueOrder = this.props.clues.slice()
    shuffle(clueOrder)

    this.state = {
      // currently selected clues
      selected: new Set(),
      // the current order of clues in the wall (left to right, top to bottom)
      clueOrder: clueOrder, 
      // the indexes of found groups (in this.props.groups)
      foundGroups: [],
      // the number of lives remaining - null means unlimited
      lives: null
    }
    // TODO: 2:30 timer, lives
  }

  tileClicked(clue) {
    let newSelected = new Set(this.state.selected)

    if (this.state.selected.has(clue)) { // deselect this clue
      // TODO: delay
      newSelected.delete(clue)
      this.setState({selected: newSelected})
      
    }else { // select this clue
      newSelected.add(clue)
      this.setState({selected: newSelected}, () => this.checkGuess())
    }
  }

  checkGuess() {
    // check whether the selected clues form a group, and handle

    if (this.state.selected.size < group_size) {
      return
    }
    
    // check if any group matches the selection
    const i = this.props.groups.findIndex(group => setEq(group, this.state.selected))
    if (i === -1 || this.state.foundGroups.includes(i)) {
      // haven't found a (new) group - deselect
      this.setState({
        selected: new Set()
      }, () => this.incorrectGuess())
      return
    }

    // group i matches the selection
    let newFoundGroups = this.state.foundGroups.slice()
    newFoundGroups.push(i)
    if (newFoundGroups.length === this.props.groups.length - 1) {
      // finding penultimate also finds final
      for (let j = 0; j < this.props.groups.length; j++) {
        if (!newFoundGroups.includes(j)) {
          newFoundGroups.push(j)
          break
        }
      }
      // solved wall!
    }

    this.setState({
      foundGroups: newFoundGroups,
      selected: new Set()
    }, () => this.correctGuess())
  }

  incorrectGuess() {
    if (this.state.lives != null) {
      let newLives = Math.max(this.state.lives - 1, 0)
      if (newLives === 0) {
        // TODO: game over
      }
      this.setState({
        lives: newLives
      })
    }
  }

  correctGuess() {
    // callback when a group has been found

    // put the found group(s) at the top
    let newClueOrder = []
    for (const i of this.state.foundGroups) {
      newClueOrder = newClueOrder.concat(Array.from(this.props.groups[i]))
    }
    // preserve the order of remaining clues
    for (const clue of this.state.clueOrder) {
      if (!newClueOrder.includes(clue)) {
        newClueOrder.push(clue)
      }
    }

    // when only two groups left, enable lives
    let newLives = this.state.lives
    if (this.state.foundGroups.length === num_groups - 2) {
      newLives = maxLives
    }

    if (this.state.foundGroups.length === num_groups) {
      // TODO: game won
    }

    this.setState({
      clueOrder: newClueOrder,
      lives: newLives
    })
  }

  render() {
    let foundGroups = this.state.foundGroups.map(i => this.props.groups[i])
    return (
      <div>
        <Wall 
          clues={this.props.clues}
          clueOrder={this.state.clueOrder} 
          selected={this.state.selected}
          foundGroups={foundGroups}
          onClick={clue => this.tileClicked(clue)} />
        {this.state.lives != null && <HealthBar lives={this.state.lives} maxLives={maxLives}/>}
      </div>
    )
  }
}


function App() {
  const clues = [
    "A1", "A2", "A3", "A4",
    "B1", "B2", "B3", "B4",
    "C1", "C2", "C3", "C4",
    "D1", "D2", "D3", "D4",
  ]
  const groups = [
    new Set(["A1", "A2", "A3", "A4"]), 
    new Set(["B1", "B2", "B3", "B4"]), 
    new Set(["C1", "C2", "C3", "C4"]), 
    new Set(["D1", "D2", "D3", "D4"])]
  // TODO **** game doesn't respond to changes in props!! - anti pattern?
  // TODO: just take groups & build clues from there
  return <Game clues={clues} groups={groups}/>
}

export default App;
