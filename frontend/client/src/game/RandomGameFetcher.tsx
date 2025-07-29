
import React, { useEffect } from 'react';
import Fetcher from '../common/Fetcher';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Game, { GameProps } from './Game';
import { buildProps } from './GameFetcher';

// pushes the wall id to router history once mounted
function HistoryInjector(props: GameProps & RouteComponentProps & { id: string }) {
  useEffect(() => props.history.push(`/walls/${props.id}`));
  return <Game {...props} />;
}

function RandomGameFetcher() {
  return (
    <Fetcher
      component={withRouter(HistoryInjector)}
      url={`/api/walls/random`}
      buildProps={data => ({ id: data._id, ...buildProps(data) })}
    />
  )
}

export default RandomGameFetcher;
