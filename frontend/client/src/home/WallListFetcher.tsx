
import React from 'react';
import Fetcher from '../common/Fetcher';
import { WallSymbolName } from '../common/WallSymbol';
import WallList, { WallListProps } from './WallList';

type WallSummaryModel = {
  _id: string,
  series: number,
  episode: number,
  symbolName: WallSymbolName
};

function buildProps(walls: WallSummaryModel[]): WallListProps {
  let props: WallListProps = { walls: [] };
  for (const wall of walls) {
    props.walls.push({
      id: wall._id,
      series: wall.series,
      episode: wall.episode,
      symbolName: wall.symbolName
    });
  }
  return props;
}

function WallListFetcher() {
  return (
    <Fetcher 
      component={WallList}
      url="/api/walls"
      buildProps={buildProps}
    />
  );
}

export default WallListFetcher;
