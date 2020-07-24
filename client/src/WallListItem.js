
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function WallListItem(props) {
  return (
    <li className="wall-list-item">
      <Link to={`/walls/${props.id}`}>
        Series {props.series} Episode {props.episode} - {props.symbolName}
      </Link>
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
