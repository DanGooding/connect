
import React from 'react';
import GameWall from './GameWall.js';
import Results from './Results.js';
import { numGroups } from './constants.js';

class GamePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // TODO: fetch these & shuffle clues(?)
      clues: [
        "A1", "A2", "A3",
        "B1", "B2", "B3",
        "C1", "C2", "C3",
      ],
      groups: [
        new Set(["A1", "A2", "A3"]), 
        new Set(["B1", "B2", "B3"]), 
        new Set(["C1", "C2", "C3"])
      ],
      connections: [
        "all A",
        "all B",
        "all C"
      ],
      gameFinished: false,
      numFoundGroups: null,
      numCorrectConnections: null,
      livesRemaining: null
    };

    this.wallSolved = this.wallSolved.bind(this);
    this.wallFailed = this.wallFailed.bind(this);
    this.gameFinished = this.gameFinished.bind(this);
  }

  wallSolved(livesRemaining) {
    this.setState({
      numFoundGroups: numGroups,
      livesRemaining
    });
  }

  wallFailed(numFoundGroups, livesRemaining) {
    this.setState({
      numFoundGroups,
      livesRemaining
    });
  }

  gameFinished(numCorrectConnections) {
    this.setState({
      gameFinished: true,
      numCorrectConnections,
    })
  }

  render() {
    if (this.state.gameFinished) {
      return <Results
        numFoundGroups={this.state.numFoundGroups}
        numCorrectConnections={this.state.numCorrectConnections}
      />;
      // TODO: also an exit button?
      // TODO: save (time / completed flag) for this wall? (cookies)
    }else {
      // TODO: ? one single callback that recives all info on finish
      return <GameWall 
        clues={this.state.clues} 
        groups={this.state.groups}
        connections={this.state.connections}
        onSolve={this.wallSolved}
        onFail={this.wallFailed}
        onFinish={this.gameFinished}
      />;
    }
  }
}

export default GamePage;
