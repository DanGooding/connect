
import React from 'react';
import Wall from './Wall.js';
import HealthBar from './HealthBar.js';
import { setEq, shuffle } from './utils.js';
import { groupSize, numGroups, maxLives } from './constants.js';

class Game extends React.Component {
  constructor(props) {
    super(props);
    // this.props.clues - array of all clues (strings)
    // this.props.groups - array of groups, each is a Set of clues
    
    let clueOrder = this.props.clues.slice();
    shuffle(clueOrder);

    this.state = {
      // currently selected clues
      selected: new Set(),
      // the current order of clues in the wall (left to right, top to bottom)
      clueOrder: clueOrder, 
      // the indexes of found groups (in this.props.groups)
      foundGroups: [],
      // the number of lives remaining - null means unlimited
      lives: null,
      // whether input is accepted or ignored - set to true when out of lives or time
      frozen: false
    };
    // TODO: 2:30 timer
  }

  tileClicked(clue) {
    if (this.state.frozen) return;
    if (this.state.selected.size === groupSize) return;  // TODO: this is a hack

    let newSelected = new Set(this.state.selected);

    if (this.state.selected.has(clue)) { // deselect this clue
      // TODO: delay
      newSelected.delete(clue);
      this.setState({selected: newSelected});
      
    }else { // select this clue
      newSelected.add(clue);
      this.setState({selected: newSelected}, () => this.checkGuess());
    }
  }

  // check whether the selected clues form a group, and handle
  checkGuess() {

    if (this.state.selected.size < groupSize) return;
    
    // check if any group matches the selection
    const i = this.props.groups.findIndex(group => setEq(group, this.state.selected));
    if (i === -1 || this.state.foundGroups.includes(i)) {
      // haven't found a (new) group - deselect
      setTimeout(() =>
        this.setState({
          selected: new Set()
        }, () => this.incorrectGuess()),
        500);
      return;
    }

    // group i matches the selection
    let newFoundGroups = this.state.foundGroups.slice();
    newFoundGroups.push(i);
    if (newFoundGroups.length === this.props.groups.length - 1) {
      // finding penultimate also finds final
      for (let j = 0; j < this.props.groups.length; j++) {
        if (!newFoundGroups.includes(j)) {
          newFoundGroups.push(j);
          break;
        }
      }
      // solved wall!
    }

    this.setState({
      foundGroups: newFoundGroups,
      selected: new Set()
    }, () => this.correctGuess());
  }

  incorrectGuess() {
    if (this.state.lives != null) {

      let newState = {
        lives: Math.max(this.state.lives - 1, 0)
      };
      if (newState.lives === 0) {
        // TODO: game over
        newState.frozen = true;
      }
      this.setState(newState);
    }
  }

  // called when a group has been found
  correctGuess() {
    // TODO: swap order of these
    this.updateClueOrder(() => {
      if (this.state.foundGroups.length === numGroups) {
        // TODO: game won
      }
      // when only two groups left, enable lives
      if (this.state.foundGroups.length === numGroups - 2) {
        this.setState({lives: maxLives});
      }
    });
  }

  // update the order of clues in the wall to reflect changes in foundGroups
  updateClueOrder(callback) {

    // put the found group(s) at the top
    let newClueOrder = [];
    for (const i of this.state.foundGroups) {
      newClueOrder = newClueOrder.concat(Array.from(this.props.groups[i]));
    }
    // preserve the order of remaining clues
    for (const clue of this.state.clueOrder) {
      if (!newClueOrder.includes(clue)) {
        newClueOrder.push(clue);
      }
    }
    this.setState({clueOrder: newClueOrder}, callback);
  }

  // automatically find all remaining groups
  resolve() {
    let remainingGroups = [];
    for (let i = 0; i < this.props.groups.length; i++) {
      if (!this.state.foundGroups.includes(i)) {
        remainingGroups.push(i);
      }
    }
    this.setState({
      foundGroups: this.state.foundGroups.concat(remainingGroups)
    }, () => this.updateClueOrder());
  }

  render() {
    let foundGroups = this.state.foundGroups.map(i => this.props.groups[i]);
    return (
      <div>
        <Wall 
          clues={this.props.clues}
          clueOrder={this.state.clueOrder} 
          selected={this.state.selected}
          foundGroups={foundGroups}
          onClick={clue => this.tileClicked(clue)} />
        {this.state.lives != null && <HealthBar lives={this.state.lives} maxLives={maxLives}/>}
        {this.state.lives === 0 && <button onClick={() => this.resolve()}>resolve</button>}
      </div>
    );
  }
}

export default Game;
