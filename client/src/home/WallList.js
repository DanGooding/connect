
import React from 'react';
import PropTypes from 'prop-types';
import WallListItem from './WallListItem.js';
import './WallList.css';

function WallList(props) {
  // TODO: change _id to id in api ?
  const items = props.walls.map(wall => 
    <WallListItem 
      key={wall._id} id={wall._id} 
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
  // array of objects describing each wall
  walls: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      series: PropTypes.number.isRequired,
      episode: PropTypes.number.isRequired,
      symbolName: PropTypes.string.isRequired
    })).isRequired
};

export default WallList;
