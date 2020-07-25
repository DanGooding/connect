
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const labels = ['series', 'episode', 'wall'];

function WallListItem(props) {
  const values = [props.series, props.episode, props.symbolName[0].toUpperCase()];
  const sections = values.map(
    (value, i) => 
      <div className="wall-list-item-section">
        <div className="wall-list-item-label">{labels[i]}</div>
        <div className="wall-list-item-value">{value}</div>
      </div>
    );
  return (
    <li className="wall-list-item">
      <Link to={`/walls/${props.id}`} style={{textDecoration: 'inherit', color: 'inherit'}}>
        <div className="wall-list-item-wrapper">
          {sections}
        </div>
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
