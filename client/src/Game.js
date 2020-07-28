
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Wall from './Wall.js';
import HealthBar from './HealthBar.js';
import ConnectionsForm from './ConnectionsForm.js';
import Results from './Results.js';
import { setEq, shuffle, repeat, capitalise } from './utils.js';
import { groupSize, numGroups, maxLives } from './constants.js';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // API
        // has the wall data been loaded from the api?
        isLoaded: false,
        // error message returned by the api
        fetchError: null,

      // ANSWERS
        // all clues that appear in the wall, in a fixed order
        clues: null,
        // the correct clue groupings, an array of Sets of strings
        groups: null,
        // the connection for each group
        connection: null,

      // GAME STATE
        // the current order of clues in the wall (left to right, top to bottom)
        clueOrder: null, 
        // the indexes of found groups (in this.state.groups)
        foundGroupIndices: [],
        // the indices of groups not found by the player
        // but resolved once they failed the wall
        resolvedGroupIndices: [],

        // the number of lives remaining - null means currently unlimited
        lives: null,

        // whether the wall has been won or lost? (else it's still being played)
        wallCompleted: false, // TODO: combine these two?
        wallFailed: false,

        // was the entered connection correct for each group (same order as state.groups)
        // undefined=unchecked, true/false=correct/incorrect
        connectionMarks: repeat(null, numGroups),

        // has the entire game (wall + connections) finished
        allFinished: false,

      // WALL METADATA
        // the series & episode this wall is from
        series: null,
        episode: null,
        // which wall within that episode this is (alpha | beta | lion | water)
        symbol: null
    };
    // TODO: 2:30 timer

    this.wallDataRecived = this.wallDataRecived.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
    this.resolveWall = this.resolveWall.bind(this);
    this.handleChangeMark = this.handleChangeMark.bind(this);
    this.handleFinishGame = this.handleFinishGame.bind(this);
  }

  componentDidMount() {
    // TODO: don't return an error message form api?
    // TODO: proper error page/component
    fetch(`/api/walls/${this.props.match.params.id}`)
      .then(res => {
        if (!res.ok) {
          res.json()
            .then(({error}) => 
              this.setState({fetchError: error})
            );
          return;
        }
        res.json()
          .then(this.wallDataRecived);
      })
      .catch(error =>
        this.setState({
          fetchError: `fetch error: ${error.message}`
        })
      );
  }

  wallDataRecived(wall) {
    let groups = wall.groups.slice(0, numGroups);
    for (let i = 0; i < groups.length; i++) {
      groups[i].clues = groups[i].clues.slice(0, groupSize);
    }
    // let clues = groups.flatMap(({clues}) => clues);
    let clues = groups.reduce((acc, {clues}) => acc.concat(clues), []);
    shuffle(clues);

    this.setState({
      isLoaded: true,
      clues: clues,
      clueOrder: clues.slice(),
      groups: groups.map(({clues}) => new Set(clues)),
      connections: groups.map(({connection}) => connection),
      series: wall.series,
      episode: wall.episode,
      symbol: wall.symbolName
    });
  }

  // check whether the given set of clues is a group, updating state if so, 
  // finally calling callback  once state has updated
  handleGuess(guess, callback) {
    if (guess.size < groupSize) return;
    
    // check if any group matches the guess
    const i = this.state.groups.findIndex(group => setEq(group, guess));
    if (i === -1 || this.state.foundGroupIndices.includes(i)) {
      // haven't found a (new) group
      setTimeout(() => {
        this.handleIncorrectGuess();
        callback();
      }, 500); // 'rate limit' guessing
      return;
    }

    // group i matches the guess
    let newFoundGroupIndices = this.state.foundGroupIndices.slice();
    newFoundGroupIndices.push(i);
    if (newFoundGroupIndices.length === this.state.groups.length - 1) {
      // finding penultimate also finds final
      for (let j = 0; j < this.state.groups.length; j++) {
        if (!newFoundGroupIndices.includes(j)) {
          newFoundGroupIndices.push(j);
          break;
        }
      }
    }

    this.setState({
      foundGroupIndices: newFoundGroupIndices
    }, () => this.handleCorrectGuess());
    callback();
  }

  handleIncorrectGuess() {
    if (this.state.lives != null) {

      let newState = {
        lives: Math.max(this.state.lives - 1, 0)
      };
      if (newState.lives === 0) {
        newState.wallFailed = true;
      }
      this.setState(newState);
    }
  }

  // called when a group has been found
  handleCorrectGuess() {
    // TODO: swap order of these
    if (this.state.foundGroupIndices.length === numGroups) {
      this.setState({wallCompleted: true});
    }else if (this.state.foundGroupIndices.length === numGroups - 2) {
      // when only two groups left, enable lives
      this.setState({lives: maxLives});
    }
    this.updateClueOrder();
  }

  // get the indices of all found and resolved groups
  getShownGroupIndices() {
    return this.state.foundGroupIndices.concat(this.state.resolvedGroupIndices);
  }

  // update the order of clues in the wall to reflect changes in foundGroups
  updateClueOrder() {
    // put the found group(s) at the top
    let newClueOrder = [];
    for (const i of this.getShownGroupIndices()) {
      newClueOrder = newClueOrder.concat(Array.from(this.state.groups[i]));
    }
    // preserve the order of remaining clues
    for (const clue of this.state.clueOrder) {
      if (!newClueOrder.includes(clue)) {
        newClueOrder.push(clue);
      }
    }
    this.setState({clueOrder: newClueOrder});
  }

  // automatically find all remaining groups,
  // shuffling the wall and adding them to this.state.resolvedGroupIndices
  resolveWall() {
    let remainingGroupIndices = [];
    for (let i = 0; i < this.state.groups.length; i++) {
      if (!this.state.foundGroupIndices.includes(i)) {
        remainingGroupIndices.push(i);
      }
    }

    this.setState({
      resolvedGroupIndices: remainingGroupIndices
    }, () => this.updateClueOrder());
  }

  handleChangeMark(i, newMark) {
    let connectionMarks = this.state.connectionMarks.slice();
    connectionMarks[i] = newMark;
    this.setState({connectionMarks});
  }

  // called when finished marking connections - i.e. the whole game is over
  handleFinishGame() {
    this.setState({allFinished: true});
  }

  render() {
    if (this.state.fetchError != null) {
      return <div>Error: {this.state.fetchError}</div>;
    
    }else if (!this.state.isLoaded) {
      return <div>Loading...</div>;

    }else if (this.state.allFinished) {
      return (
        <Results
          numFoundGroups={this.state.foundGroupIndices.length}
          numCorrectConnections={this.state.connectionMarks.filter(x => x).length}
        />
      );
      // TODO: also an exit button?
      // TODO: save (time / completed flag) for this wall? (cookies)
    }

    const title = 
      `Series ${this.state.series} - Episode ${this.state.episode} - ${capitalise(this.state.symbol)} wall`;

    const shownGroupIndices = this.getShownGroupIndices();
    const shownGroups = shownGroupIndices.map(i => this.state.groups[i]);
    console.log(shownGroups);

    const allMarked = this.state.connectionMarks.every(x => x != null);

    return (
      <div>
        <div className="wall-container">
          <h2>{title}</h2>
          <Wall
            clues={this.state.clues}
            clueOrder={this.state.clueOrder} 
            foundGroups={shownGroups}
            onGuess={this.handleGuess} 
            frozen={this.state.wallCompleted || this.state.wallFailed}
          />
          {this.state.lives != null && 
            <HealthBar lives={this.state.lives} maxLives={maxLives}/>
          }
        </div>
        
        {(this.state.wallCompleted || this.state.wallFailed) &&
          <div>
            <h3 className="game-over-reason">
              {(() => {
                if (this.state.wallCompleted) {
                  return 'You\'ve solved the wall!';
                }else if (this.state.lives === 0) {
                  return 'Out of lives...';
                }
                // TODO: out of time
              })()}
            </h3>
            <ConnectionsForm 
              groupIndices={shownGroupIndices}
              connections={this.state.connections}
              answersCorrect={this.state.connectionMarks}
              onChangeCorrectness={this.handleChangeMark}
              resolveWall={this.resolveWall}
            />
            {allMarked &&
              <button className="centered-button" onClick={this.handleFinishGame}>Done</button>
            }
          </div>
        }
      </div>
    );
  }
}

Game.propTypes = {
  // the url match of /walls/:id
  // added by the `withRouter` wrapper
  match: PropTypes.object.isRequired
}

export default withRouter(Game);
