
import React from 'react';
import Fetcher from '../common/Fetcher';
import { Redirect } from 'react-router-dom';
import { WallModel } from '../game/GameFetcher';

function buildProps(wall: WallModel) {
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
