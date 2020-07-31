
import React from 'react';
import PropTypes from 'prop-types';
import Tile from './Tile.js';
import { numColumns } from './constants.js';
import './Wall.css';

function Wall(props) {
  const tiles = [];
  for (const clue of props.clues) {
    const i = props.clueOrder.indexOf(clue);

    let clickable = false;
    let group = props.foundGroups.findIndex(group => group.has(clue));
    if (group === -1) {
      group = null;
      clickable = true;

      if (props.selection.has(clue)) {
        group = props.foundGroups.length;
      }
    }

    tiles.push(
      <Tile
        clue={clue}
        key={clue}
        group={group}
        column={i % numColumns} row={Math.floor(i / numColumns)}
        clickable={clickable && !props.frozen}
        onClick={() => props.onTileClick(clue)}
      />
    );
  }
  return (
    <div className="wall">
      {tiles}
    </div>
  );
}

Wall.propTypes = {
    // all clues, in the order they appear in the DOM.
    // this is unchanged even when clueOrder changes, so the css transitions work correctly
    clues: PropTypes.arrayOf(PropTypes.string).isRequired,
    // all clues specified left to right, top to bottom
    clueOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
    // the selected clues
    selection: PropTypes.instanceOf(Set),
    // the groups found so far, in order of discovery each group is a Set of clues
    foundGroups: PropTypes.arrayOf(PropTypes.instanceOf(Set)).isRequired,
    // if truthy, click input is ignored
    frozen: PropTypes.bool,
    // callback when a tile is clicked
    onTileClick: PropTypes.func.isRequired,
}

export default Wall;
