
import React from 'react';
import PropTypes from 'prop-types';
import WallListItem from './WallListItem';
import './WallList.css';
import { WallSymbolName } from '../common/WallSymbol';

export type WallListProps = {
  // array of objects describing each wall
  walls: Array<{
    id: string,
    series: number,
    episode: number,
    symbolName: WallSymbolName
  }>
};

function WallList(props: WallListProps) {
  const items = props.walls.map(wall => 
    <WallListItem 
      key={wall.id} id={wall.id} 
      series={wall.series} episode={wall.episode} 
      symbolName={wall.symbolName} 
    />);

  return (
    <div>
      <ul className="wall-list">
        {items}
      </ul>
    </div>
  );
}

WallList.propTypes = {
  walls: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      series: PropTypes.number.isRequired,
      episode: PropTypes.number.isRequired,
      symbolName: PropTypes.string.isRequired
    })).isRequired
};

export default WallList;
