
import React from 'react';
import PropTypes from 'prop-types';
import Wall from './Wall.js';
import HealthBar from './HealthBar.js';
import ConnectionsForm from './ConnectionsForm.js';
import { setEq, shuffle, capitalise } from './utils.js';
import { groupSize, numGroups, maxLives } from './constants.js';

class GameWall extends React.Component {
  constructor(props) {
    super(props);
    
    let clueOrder = this.props.clues.slice();
    shuffle(clueOrder);

    let connectionGuessCorrect = [];
    for (let i = 0; i < numGroups; i++) {
      connectionGuessCorrect.push(null);
    }

    this.state = {
      // the current order of clues in the wall (left to right, top to bottom)
      clueOrder, 
      // the indexes of found groups (in this.props.groups)
      foundGroupIndices: [],
      // the number of lives remaining - null means unlimited
      lives: null,
      // whether input is accepted or ignored - set to true when out of lives or time
      frozen: false,
      // has the wall been won or lost?
      completed: false, // TODO: combine these two?
      failed: false,
      // was the entered connection correct for each group (same order as props.groups)
      // null=unchecked, true/false=correct/incorrect
      connectionGuessCorrect
    };
    // TODO: 2:30 timer

    this.resolve = this.resolve.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
    this.onChangeCorrectness = this.onChangeCorrectness.bind(this);
    this.onFinish = this.onFinish.bind(this);
  }

  // check whether the given set of clues is a group,
  // updating state if so.
  // returns true if the guess was correct
  handleGuess(guess, callback) {
    if (guess.size < groupSize) return;
    
    // check if any group matches the guess
    const i = this.props.groups.findIndex(group => setEq(group, guess));
    if (i === -1 || this.state.foundGroupIndices.includes(i)) {
      // haven't found a (new) group
      this.incorrectGuess();
      setTimeout(callback, 500, false); // 'rate limit' guessing
      return;
    }

    // group i matches the guess
    let newFoundGroupIndices = this.state.foundGroupIndices.slice();
    newFoundGroupIndices.push(i);
    if (newFoundGroupIndices.length === this.props.groups.length - 1) {
      // finding penultimate also finds final
      for (let j = 0; j < this.props.groups.length; j++) {
        if (!newFoundGroupIndices.includes(j)) {
          newFoundGroupIndices.push(j);
          break;
        }
      }
    }

    this.setState({
      foundGroupIndices: newFoundGroupIndices
    }, () => this.correctGuess());
    callback(true);
  }

  incorrectGuess() {
    if (this.state.lives != null) {

      let newState = {
        lives: Math.max(this.state.lives - 1, 0)
      };
      if (newState.lives === 0) {
        this.props.onFail(this.state.foundGroupIndices.length, newState.lives);
        newState.failed = true;
        newState.frozen = true;
      }
      this.setState(newState);
    }
  }

  // called when a group has been found
  correctGuess() {
    // TODO: swap order of these
    this.updateClueOrder(() => {
      if (this.state.foundGroupIndices.length === numGroups) {
        this.props.onSolve(this.state.lives);
        this.setState({completed: true});
      }else if (this.state.foundGroupIndices.length === numGroups - 2) {
        // when only two groups left, enable lives
        this.setState({lives: maxLives});
      }
    });
  }

  // update the order of clues in the wall to reflect changes in foundGroups
  updateClueOrder(callback) {

    // put the found group(s) at the top
    let newClueOrder = [];
    for (const i of this.state.foundGroupIndices) {
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
      if (!this.state.foundGroupIndices.includes(i)) {
        remainingGroups.push(i);
      }
    }
    this.setState({
      foundGroupIndices: this.state.foundGroupIndices.concat(remainingGroups)
    }, () => this.updateClueOrder());
  }

  onChangeCorrectness(i, newCorrectness) {
    let connectionGuessCorrect = this.state.connectionGuessCorrect.slice();
    connectionGuessCorrect[i] = newCorrectness;
    // TODO: now if all non null, can proceed
    this.setState({connectionGuessCorrect});
  }

  onFinish() {
    const numCorrect = this.state.connectionGuessCorrect.filter(x => x === true).length;
    this.props.onFinish(numCorrect);
  }

  render() {
    const title = `Series ${this.props.series} - Episode ${this.props.episode} - ${capitalise(this.props.symbol)} wall`;
    const foundGroups = this.state.foundGroupIndices.map(i => this.props.groups[i]);

    let reason;
    if (this.state.completed) {
      reason = "You've solved the wall!";
    }else if (this.state.lives === 0) {
      reason = 'Out of lives...';
    }
    // TODO: out of time

    const allMarked = this.state.connectionGuessCorrect.every(x => x != null);
    
    return (
      <div>
        <div className="wall-container">
          <h2>{title}</h2>
          <Wall
            clues={this.props.clues}
            clueOrder={this.state.clueOrder} 
            foundGroups={foundGroups}
            handleGuess={this.handleGuess} 
            frozen={this.state.frozen}
          />
          {this.state.lives != null && <HealthBar lives={this.state.lives} maxLives={maxLives}/>}
        </div>
        
        {(this.state.completed || this.state.failed) &&
          <div>
            <h3 className="game-over-reason">{reason}</h3>
            <ConnectionsForm 
              groupIndices={this.state.foundGroupIndices}
              connections={this.props.connections}
              answersCorrect={this.state.connectionGuessCorrect}
              onChangeCorrectness={this.onChangeCorrectness}
              resolveWall={this.resolve}
            />
            {allMarked &&
              <button className="centered-button" onClick={this.onFinish}>Done</button>
            }
          </div>
        }
      </div>
    );
  }
}

GameWall.propTypes = {
  // all clues to appear in the wall
  clues: PropTypes.arrayOf(PropTypes.string).isRequired,
  // the correct groupings of clues
  groups: PropTypes.arrayOf(PropTypes.instanceOf(Set)).isRequired,
  // the connections for each group
  connections: PropTypes.arrayOf(PropTypes.string).isRequired,

  // callback when all groups found
  onSolve: PropTypes.func.isRequired,
  // callback when out of time or lives
  onFail: PropTypes.func.isRequired,
  // callback when completely over (wall finished, connections checked)
  onFinish: PropTypes.func.isRequired,

  // the series & episode this wall is from
  series: PropTypes.number.isRequired,
  episode: PropTypes.number.isRequired,
  // which wall within that episode this is (alpha | beta | lion | water)
  symbol: PropTypes.string.isRequired
}


export default GameWall;
