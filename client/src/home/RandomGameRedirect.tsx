
import React from 'react';
import Fetcher from '../common/Fetcher';
import { Redirect } from 'react-router-dom';
import { WallModel } from '../game/GameFetcher';

type RedirectProps = { to: string }
function buildProps(wall: WallModel): RedirectProps {
  return { to: `/walls/${wall._id}` };
}

// redirects to a random wall
// TODO: this is an awful hack (gets the same data twice!)
function RandomGameRedirect() {
  return (
    <Fetcher
      component={Redirect}
      url="/api/walls/random"
      buildProps={buildProps}
    />
  );
}

export default RandomGameRedirect;
