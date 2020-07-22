
import React from 'react';
import GameWall from './GameWall.js';
import Results from './Results.js';
import { numGroups, groupSize } from './constants.js';
import { shuffle } from './utils.js';

class GamePage extends React.Component {
  constructor(props) {
    super(props);

    // TODO: fetch these
    const wall = {
      groups: [
        {
          clues: ["A1", "A2", "A3", "A4"],
          connection: "all A"
        },
        {
          clues: ["B1", "B2", "B3", "B4"],
          connection: "all B"
        },
        {
          clues: ["C1", "C2", "C3", "C4"],
          connection: "all C"
        },
        {
          clues: ["D1", "D2", "D3", "D4"],
          connection: "all D"
        }
      ]
    };

    let groups = wall.groups.slice(0, numGroups);
    for (let i = 0; i < groups.length; i++) {
      groups[i].clues = groups[i].clues.slice(0, groupSize);
    }
    let clues = groups.flatMap(({clues}) => clues);
    shuffle(clues);
      
    this.state = {
      clues,
      groups: groups.map(({clues}) => new Set(clues)),
      connections: groups.map(({connection}) => connection),
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
