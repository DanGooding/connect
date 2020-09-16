
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Fetcher from '../common/Fetcher.js';
import Game from './Game.js';
import { numGroups, groupSize } from '../common/constants.js';
import { shuffle } from '../common/utils.js';

// take api response data, and trasform into the props `Game` expects
function buildProps(wall) {
  let groups = wall.groups.slice(0, numGroups);
  for (let i = 0; i < groups.length; i++) {
    groups[i].clues = groups[i].clues.slice(0, groupSize);
  }
  // let clues = groups.flatMap(({clues}) => clues);
  let clues = groups.reduce((acc, {clues}) => acc.concat(clues), []);

  // so don't appear in correct order in the DOM
  shuffle(clues);

  return {
    clues,
    groups: groups.map(({clues}) => new Set(clues)),
    connections: groups.map(({connection}) => connection),
    series: wall.series,
    episode: wall.episode,
    symbol: wall.symbolName
  };
}

function GameFetcher(props) {
  return (
    <Fetcher 
      component={Game}
      url={`/api/walls/${props.match.params.id}`}
      buildProps={buildProps}
    />
  );
}

GameFetcher.propTypes = {
  // the url match of /walls/:id
  // added by the `withRouter` wrapper
  match: PropTypes.object.isRequired
};

export default withRouter(GameFetcher);
