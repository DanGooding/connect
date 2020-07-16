
import React from 'react';

// a box for a single clue in a Wall
function Tile(props) {
  // props.clue - string of the clue for this tile
  // props.column, props.row - 0 indexed position in the wall
  // props.selected - truthy if currently selected  (mutually exclusive with props.group)
  // props.group - 0 for first found, 1 for second ...
  //               else null if clue's group hasn't been found

  let className = "tile";
  className += ` column_${props.column} row_${props.row}`;
  if (props.selected) {
    className += " selected";
  }
  let onClick;
  if (props.group == null) {
    onClick = props.onClick;
  }else {
    className += ` group_${props.group}`;
  }
  return (
    <div className={className} onClick={onClick}>
      <div className="clue noselect">
        {props.clue}
      </div>
    </div>
  );
}

export default Tile;
