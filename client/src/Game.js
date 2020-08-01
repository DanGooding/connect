
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Wall from './Wall.js';
import HealthBar from './HealthBar.js';
import WallSymbol from './WallSymbol.js';
import TimerBar from './TimerBar.js';
import ConnectionsForm from './ConnectionsForm.js';
import Results from './Results.js';
import LoadingIndicator from './LoadingIndicator.js';
import { setEq, shuffle, repeat } from './utils.js';
import { groupSize, numGroups, maxLives, wallDuration } from './constants.js';
import ErrorMessage from './ErrorMessage.js';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // API
        // has the wall data been loaded from the api?
        isLoaded: false,
        // error returned from the api request { code, message }
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
        // the selected clues
        selection: new Set(),
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

    this.wallDataRecived = this.wallDataRecived.bind(this);
    this.handleTileClick = this.handleTileClick.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
    this.handleTimeUp = this.handleTimeUp.bind(this);
    this.resolveWall = this.resolveWall.bind(this);
    this.handleChangeMark = this.handleChangeMark.bind(this);
    this.handleFinishGame = this.handleFinishGame.bind(this);
  }

  componentDidMount() {
    // TODO: don't return an error message form api?
    // TODO: proper error page/component
    fetch(`/api/walls/${this.props.match.params.id}`)
      // got response
      .then(res => {
        if (!res.ok) {
          res.json()
            // api responded with error message
            .then(({error}) => 
              this.setState({fetchError: {code: res.status, message: error}})
            )
            // didn't get through to api server
            .catch(() => {
              this.setState({fetchError: {code: res.status, message: res.statusText}})
            });
          return;
        }
        res.json()
          // successful response from api
          .then(this.wallDataRecived);
      })
      // network failure
      .catch(error =>
        this.setState({
          fetchError: {
            // code: ?
            message: 'Network disconnected'
          }
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

  handleTileClick(clue) {
    if (this.state.wallCompleted || this.state.wallFailed) return;
    if (this.state.selection.size === groupSize) return;  // TODO: this is a hack
  
    let newSelection = new Set(this.state.selection);
  
    if (this.state.selection.has(clue)) { // deselect this clue
      // TODO: delay
      newSelection.delete(clue);
      this.setState({selection: newSelection});
      
    }else { // select this clue
      newSelection.add(clue);
      this.setState({selection: newSelection}, () => {
        if (this.state.selection.size === groupSize) {
          this.handleGuess();
        }
      });
    }
  }

  // check whether the selection is a group, updating state if so, 
  handleGuess() {
    if (this.state.selection.size < groupSize) return;
    
    // check if any group matches the guess
    const i = this.state.groups.findIndex(group => setEq(group, this.state.selection));
    if (i === -1 || this.state.foundGroupIndices.includes(i)) {
      // haven't found a (new) group
      setTimeout(() => {
        this.didGuessWrong();
        this.setState({selection: new Set()});
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
      foundGroupIndices: newFoundGroupIndices,
      selection: new Set()
    }, () => this.didGuessRight());
  }

  didGuessWrong() {
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
  didGuessRight() {
    if (this.state.foundGroupIndices.length === numGroups) {
      this.setState({wallCompleted: true});
    }else if (this.state.foundGroupIndices.length === numGroups - 2) {
      // when only two groups left, enable lives
      this.setState({lives: maxLives});
    }
    this.updateClueOrder();
  }

  // time for the wall has run out
  handleTimeUp() {
    this.setState({
      wallFailed: true
    });
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
      resolvedGroupIndices: remainingGroupIndices,
      selection: new Set()
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
      return <ErrorMessage code={this.state.fetchError.code} message={this.state.fetchError.message} />;
    
    }else if (!this.state.isLoaded) {
      return <LoadingIndicator />;

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

    const shownGroupIndices = this.getShownGroupIndices();
    const shownGroups = shownGroupIndices.map(i => this.state.groups[i]);

    const wallOver = this.state.wallCompleted || this.state.wallFailed;

    return (
      <div>
        <div className="wall-container">
          <h2>Series {this.state.series} - Episode {this.state.episode} - <WallSymbol symbol={this.state.symbol} /> wall</h2>
          <Wall
            clues={this.state.clues}
            clueOrder={this.state.clueOrder} 
            selection={this.state.selection}
            foundGroups={shownGroups} 
            frozen={wallOver}
            onTileClick={this.handleTileClick}
          />
          <TimerBar 
            duration={wallDuration} 
            paused={wallOver}
            onFinish={this.handleTimeUp} 
          />
          {this.state.lives != null && 
            <HealthBar lives={this.state.lives} maxLives={maxLives}/>
          }
        </div>
        
        {wallOver &&
          <div>
            <h3 className="game-over-reason">
              {(() => {
                if (this.state.wallCompleted) {
                  return 'You\'ve solved the wall!';
                }else if (this.state.lives === 0) {
                  return 'Out of lives...';
                }else {
                  return 'Out of time...';
                }
              })()}
            </h3>
            <ConnectionsForm 
              groupIndices={shownGroupIndices}
              connections={this.state.connections}
              answerMarks={this.state.connectionMarks}
              onChangeCorrectness={this.handleChangeMark}
              resolveWall={this.resolveWall}
              finishGame={this.handleFinishGame}
            />
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
