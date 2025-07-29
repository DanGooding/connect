
import React from 'react';
import PropTypes from 'prop-types';
import Wall from './Wall';
import HealthBar from './HealthBar';
import WallSymbol, { WallSymbolName } from '../common/WallSymbol';
import TimerBar from './TimerBar';
import ConnectionsForm from './ConnectionsForm';
import Results from './Results';
import { setEq, shuffle, repeat } from '../common/utils';
import { groupSize, numGroups, maxLives, wallDuration } from '../common/constants';

export type GameProps = {
  // all clues that appear in the wall, in a fixed order
  clues: string[],
  // the correct clue groupings, an array of Sets of strings
  groups: Array<Set<string>>,
  // the connection for each group
  connections: Array<string>,
  // the series & episode this wall is from
  series: number,
  episode: number,
  // which wall within that episode this is (alpha | beta | lion | water)
  symbolName: WallSymbolName
};

type GameState = {
  // the current order of clues in the wall (left to right, top to bottom)
  clueOrder: string[],
  // the selected clues
  selection: Set<string>,
  // the indexes of found groups (in this.props.groups)
  foundGroupIndices: number[],
  // the indices of groups not found by the player
  // but resolved once they failed the wall
  resolvedGroupIndices: number[],

  // the number of lives remaining - null means currently unlimited
  lives: number | null,
  // whether the wall has been won or lost? (else it's still being played)
  wallOutcome: "completed" | "failed" | "ongoing",
  // was the entered connection correct for each group (same order as props.groups)
  // undefined=unchecked, true/false=correct/incorrect
  connectionMarks: (boolean | undefined | null)[],

  // has the entire game (wall + connections) finished
  allFinished: boolean
};

class Game extends React.Component<GameProps, GameState> {
  static propTypes = {
    clues: PropTypes.arrayOf(PropTypes.string).isRequired,
    groups: PropTypes.arrayOf(PropTypes.instanceOf(Set)),
    connections: PropTypes.arrayOf(PropTypes.string).isRequired,
    series: PropTypes.number.isRequired,
    episode: PropTypes.number.isRequired,
    symbolName: PropTypes.string.isRequired
  }

  state: GameState = {
    clueOrder: [],
    selection: new Set(),
    foundGroupIndices: [],
    resolvedGroupIndices: [],

    lives: null,

    wallOutcome: "ongoing",

    connectionMarks: repeat(null, numGroups),

    allFinished: false,
  };

  constructor(props: GameProps) {
    super(props);

    let clueOrder = props.clues.slice();
    shuffle(clueOrder);

    this.state.clueOrder = clueOrder;

    this.handleTileClick = this.handleTileClick.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
    this.handleTimeUp = this.handleTimeUp.bind(this);
    this.resolveWall = this.resolveWall.bind(this);
    this.handleChangeMark = this.handleChangeMark.bind(this);
    this.handleFinishGame = this.handleFinishGame.bind(this);
  }

  handleTileClick(clue: string) {
    if (this.state.wallOutcome !== "ongoing") return;
    if (this.state.selection.size === groupSize) return;

    let newSelection = new Set(this.state.selection);

    if (this.state.selection.has(clue)) { // deselect this clue
      newSelection.delete(clue);
      this.setState({ selection: newSelection });

    } else { // select this clue
      newSelection.add(clue);
      this.setState({ selection: newSelection }, () => {
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
    const i = this.props.groups.findIndex(group => setEq(group, this.state.selection));
    if (i === -1 || this.state.foundGroupIndices.includes(i)) {
      // haven't found a (new) group
      setTimeout(() => {
        this.didGuessWrong();
        this.setState({ selection: new Set() });
      }, 500); // 'rate limit' guessing
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
      foundGroupIndices: newFoundGroupIndices,
      selection: new Set()
    }, () => this.didGuessRight());
  }

  didGuessWrong() {
    if (this.state.lives != null) {
      const lives = Math.max(this.state.lives - 1, 0);
      if (lives === 0) {
        this.setState({ lives, wallOutcome: "failed" });
      } else {
        this.setState({ lives });
      }
    }
  }

  // called when a group has been found
  didGuessRight() {
    if (this.state.foundGroupIndices.length === numGroups) {
      this.setState({ wallOutcome: "completed" });
    } else if (this.state.foundGroupIndices.length === numGroups - 2) {
      // when only two groups left, enable lives
      this.setState({ lives: maxLives });
    }
    this.updateClueOrder();
  }

  // time for the wall has run out
  handleTimeUp() {
    this.setState({
      wallOutcome: "failed"
    });
  }

  // get the indices of all found and resolved groups
  getShownGroupIndices() {
    return this.state.foundGroupIndices.concat(this.state.resolvedGroupIndices);
  }

  // update the order of clues in the wall to reflect changes in foundGroups
  updateClueOrder() {
    // put the found group(s) at the top
    let newClueOrder: string[] = [];
    for (const i of this.getShownGroupIndices()) {
      newClueOrder = newClueOrder.concat(Array.from(this.props.groups[i]));
    }
    // preserve the order of remaining clues
    for (const clue of this.state.clueOrder) {
      if (!newClueOrder.includes(clue)) {
        newClueOrder.push(clue);
      }
    }
    this.setState({ clueOrder: newClueOrder });
  }

  // automatically find all remaining groups,
  // shuffling the wall and adding them to this.state.resolvedGroupIndices
  resolveWall() {
    let remainingGroupIndices = [];
    for (let i = 0; i < this.props.groups.length; i++) {
      if (!this.state.foundGroupIndices.includes(i)) {
        remainingGroupIndices.push(i);
      }
    }
    this.setState({
      resolvedGroupIndices: remainingGroupIndices,
      selection: new Set()
    }, () => this.updateClueOrder());
  }

  handleChangeMark(i: number, newMark: boolean) {
    let connectionMarks = this.state.connectionMarks.slice();
    connectionMarks[i] = newMark;
    this.setState({ connectionMarks });
  }

  // called when finished marking connections - i.e. the whole game is over
  handleFinishGame() {
    this.setState({ allFinished: true });
  }

  render() {
    if (this.state.allFinished) {
      return (
        <Results
          numFoundGroups={this.state.foundGroupIndices.length}
          numCorrectConnections={this.state.connectionMarks.filter(x => x).length}
        />
      );
    }

    const shownGroupIndices = this.getShownGroupIndices();
    const shownGroups = shownGroupIndices.map(i => this.props.groups[i]);

    const wallOver = this.state.wallOutcome !== "ongoing";

    return (
      <div>
        <div className="wall-container">
          <h2>Series {this.props.series} - Episode {this.props.episode} - <WallSymbol symbolName={this.props.symbolName} /> wall</h2>
          <Wall
            clues={this.props.clues}
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
            <HealthBar lives={this.state.lives} maxLives={maxLives} />
          }
        </div>

        {wallOver &&
          <div>
            <h3 className="game-over-reason">
              {(() => {
                if (this.state.wallOutcome === "completed") {
                  return 'You\'ve solved the wall!';
                } else if (this.state.lives === 0) {
                  return 'Out of lives...';
                } else {
                  return 'Out of time...';
                }
              })()}
            </h3>
            <ConnectionsForm
              groupIndices={shownGroupIndices}
              connections={this.props.connections}
              answerMarks={this.state.connectionMarks}
              onChangeMark={this.handleChangeMark}
              resolveWall={this.resolveWall}
              finishGame={this.handleFinishGame}
            />
          </div>
        }
      </div>
    );
  }
}

export default Game;
