
import React from 'react';
import PropTypes from 'prop-types';

type TileProps = {
  // the clue for this tile
  clue: string,
  // 0 indexed position in the wall (from left/top)
  column: number,
  row: number,
  // 0 if in first group found, 1 if in second etc.
  // else null if clue's group hasn't been found
  group: number | null | undefined,
  // should respond to clicks
  clickable: boolean,
  // callback when clicked
  onClick: React.MouseEventHandler<HTMLElement>
};

// a box for a single clue in a Wall
function Tile(props: TileProps) {
  let className = "tile";
  className += ` column-${props.column} row-${props.row}`;
  if (props.group != null) {
    className += ` group group-${props.group}`;
  }else if (props.clickable) {
    className += ' selectable';
  }
  return (
    <div className={className} onClick={props.clickable ? props.onClick : undefined}>
      <div className="clue noselect">
        {props.clue}
      </div>
    </div>
  );
}

Tile.propTypes = {
  clue: PropTypes.string.isRequired,
  column: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
  group: PropTypes.number,
  clickable: PropTypes.bool,
  onClick: PropTypes.func
}

export default Tile;
