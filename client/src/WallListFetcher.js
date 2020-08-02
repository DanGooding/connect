
import React from 'react';
import Fetcher from './Fetcher.js';
import WallList from './WallList.js';

function WallListFetcher() {
  return (
    <Fetcher 
      component={WallList}
      url="/api/walls"
      buildProps={walls => ({ walls })}
    />
  );
}

export default WallListFetcher;
