
import React from 'react';
import GameWall from './GameWall.js';

class GamePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // TODO: fetch these & shuffle clues(?)
      clues: [
        "A1", "A2", "A3", "A4",
        "B1", "B2", "B3", "B4",
        "C1", "C2", "C3", "C4",
        "D1", "D2", "D3", "D4",
      ],
      groups: [
        new Set(["A1", "A2", "A3", "A4"]), 
        new Set(["B1", "B2", "B3", "B4"]), 
        new Set(["C1", "C2", "C3", "C4"]), 
        new Set(["D1", "D2", "D3", "D4"])
      ],
      connections: [
        "all A",
        "all B",
        "all C",
        "all D"
      ],

      wallFinished: false,
      finalWallState: null
    };
  }

  wallSolved(livesRemaining) {
    // TODO: also take timeRemaining
    console.log('complete!');
    this.setState({
      wallFinished: true,
      finalWallState: {
        solved: true,
        livesRemaining
      }
    });
  }
  wallFailed(numFoundGroups, livesRemaining) {
    console.log('failed');
    this.setState({
      wallFinished: true,
      finalWallState: {
        solved: false,
        numFoundGroups,
        livesRemaining
      }
    });
  }

  render() {
    return <GameWall 
      clues={this.state.clues} 
      groups={this.state.groups}
      connections={this.state.connections}
      onSolve={this.wallSolved.bind(this)}
      onFail={this.wallFailed.bind(this)}
    />;
  }
}

export default GamePage;
