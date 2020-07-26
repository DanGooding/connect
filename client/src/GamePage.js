
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import GameWall from './GameWall.js';
import Results from './Results.js';
import { numGroups, groupSize } from './constants.js';
import { shuffle } from './utils.js';

class GamePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // has the wall loaded from the api?
      isLoaded: false,
      // error returned by the api
      fetchError: null,
      
      // has the entire game (wall + connections) finished
      gameFinished: false,
      // how many groups were found, set when wall finishes
      numFoundGroups: null,
      // how many connections were identified
      numCorrectConnections: null,
      // how many lives were left when the wall finished
      livesRemaining: null
    };

    this.wallDataRecived = this.wallDataRecived.bind(this);
    this.wallSolved = this.wallSolved.bind(this);
    this.wallFailed = this.wallFailed.bind(this);
    this.gameFinished = this.gameFinished.bind(this);
  }

  componentDidMount() {
    
    // results of this request
    // - no response   (error: "Failed to fetch")
    // - non json response  -- .json() errors   *** will this ever happen in production?
    // - API response
    //   - failed: 404 or like (with json error explanation)
    //   - success: got wall object

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
    let clues = groups.flatMap(({clues}) => clues);
    shuffle(clues);

    this.setState({
      isLoaded: true,
      clues,
      groups: groups.map(({clues}) => new Set(clues)),
      connections: groups.map(({connection}) => connection)
    });
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
    });
  }

  render() {
    if (this.state.fetchError != null) {
      return <div>Error: {this.state.fetchError}</div>;
    
    }else if (!this.state.isLoaded) {
      return <div>Loading...</div>;

    }else if (this.state.gameFinished) {
      return <Results
        numFoundGroups={this.state.numFoundGroups}
        numCorrectConnections={this.state.numCorrectConnections}
      />;
      // TODO: also an exit button?
      // TODO: save (time / completed flag) for this wall? (cookies)
    }else {
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

GamePage.propTypes = {
  // the url match of /walls/:id
  // added by the `withRouter` wrapper
  match: PropTypes.object.isRequired
};

export default withRouter(GamePage);
