
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Fetcher from '../common/Fetcher';
import Game, { GameProps } from './Game';
import { numGroups, groupSize } from '../common/constants';
import { shuffle } from '../common/utils';
import { WallSymbolName } from '../common/WallSymbol';

// api wall object type
export type WallModel = {
  _id: string,
  series: number,
  episode: number,
  symbolIndex: number,
  symbolName: WallSymbolName,
  groups: Array<{
    clues: string[],
    connection: string
  }>
};

// take api response data, and trasform into the props `Game` expects
function buildProps(wall: WallModel): GameProps {
  let groups = wall.groups.slice(0, numGroups);
  for (let i = 0; i < groups.length; i++) {
    groups[i].clues = groups[i].clues.slice(0, groupSize);
  }
  // let clues = groups.flatMap(({clues}) => clues);
  let clues = groups.reduce(
    (acc: string[], {clues}: {clues: string[]}) => acc.concat(clues), []);

  // so don't appear in correct order in the DOM
  shuffle(clues);

  return {
    clues,
    groups: groups.map(({clues}) => new Set(clues)),
    connections: groups.map(({connection}) => connection),
    series: wall.series,
    episode: wall.episode,
    symbolName: wall.symbolName
  };
}

// TODO RouteComponentProps<{id: string}> should be possible but TS isn't allowing it
// https://stackoverflow.com/questions/48138111/what-typescript-type-should-i-use-to-reference-the-match-object-in-my-props
type GameFetcherProps = RouteComponentProps & {
  match: any
};

function GameFetcher(props: GameFetcherProps) {
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
