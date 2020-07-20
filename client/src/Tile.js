
import React from 'react';
import PropTypes from 'prop-types';

// a box for a single clue in a Wall
function Tile(props) {
  let className = "tile";
  className += ` column-${props.column} row-${props.row}`;
  if (props.selected) {
    className += " selected";
  }
  let onClick;
  if (props.group == null) {
    onClick = props.onClick;
  }else {
    className += ` group group-${props.group}`;
  }
  return (
    <div className={className} onClick={onClick}>
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
  // truthy if currently selected (mutually exclusive with group)
  selected: PropTypes.bool,
  // 0 if in first group found, 1 if in second etc.
  // else null if clue's group hasn't been found
  group: PropTypes.number
}

export default Tile;
