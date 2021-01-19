
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import WallSymbol from '../common/WallSymbol';

function WallListItem(props) {
  return (
    <li className="wall-list-item">
      <Link to={`/walls/${props.id}`} style={{textDecoration: 'inherit', color: 'inherit'}}>
        <div className="wall-list-item-wrapper">
          
          <div className="wall-list-item-label">series</div>
          <div className="wall-list-item-value">{props.series}</div>

          <div className="wall-list-item-label">episode</div>
          <div className="wall-list-item-value">{props.episode}</div>

          <div className="wall-list-item-label">wall</div>
          <div className="wall-list-item-value">
            <WallSymbol symbolName={props.symbolName} />
          </div>

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
