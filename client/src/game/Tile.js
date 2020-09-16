
import React from 'react';
import PropTypes from 'prop-types';

// a box for a single clue in a Wall
function Tile(props) {
  let className = "tile";
  className += ` column-${props.column} row-${props.row}`;
  if (props.group != null) {
    className += ` group group-${props.group}`;
  }else if (props.clickable) {
    className += ' selectable';
  }
  return (
    <div className={className} onClick={props.clickable ? props.onClick : null}>
      <div className="clue noselect">
        {props.clue}
      </div>
    </div>
  );
}

Tile.propTypes = {
  // the clue for this tile
  clue: PropTypes.string.isRequired,
  // 0 indexed position in the wall (from left/top)
  column: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
  // 0 if in first group found, 1 if in second etc.
  // else null if clue's group hasn't been found
  group: PropTypes.number,
  // truthy should respond to clicks
  clickable: PropTypes.bool,
  // callback when clicked
  onClick: PropTypes.func
}

export default Tile;
