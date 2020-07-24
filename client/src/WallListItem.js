
import React from 'react';
import PropTypes from 'prop-types';

function WallListItem(props) {
  return (
    <li className="wall-list-item">
      Series {props.series} Episode {props.episode} {props.symbolName}
    </li>
  );
}

WallListItem.propTypes = {
  series: PropTypes.number.isRequired,
  episode: PropTypes.number.isRequired,
  symbolName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default WallListItem;
