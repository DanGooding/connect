
import React from 'react';
import Tile from './Tile.js';
import { numColumns } from './constants.js';
import './style.css';

function Wall(props) {
  // props.clues - array of all clues, in the order they appear in the DOM
  //               this is fixed even when props.clueOrder changes, so the css transitions work correctly
  // props.clueOrder - array of all clues specified left to right, top to bottom
  // props.foundGroups - array of the groups found so far, in order of discovery
  //                     each group is a Set of clues
  // props.selected - Set of selected clues
  // props.onClick - callback for when a tile is clicked, takes the clue as an argument
  const tiles = [];
  for (const clue of props.clues) {
    const i = props.clueOrder.indexOf(clue);

    let group = props.foundGroups.findIndex(group => group.has(clue));
    if (group === -1) group = null;

    tiles.push(
      <Tile 
        clue={clue} 
        key={clue}
        selected={props.selected.has(clue)}
        group={group}
        column={i % numColumns} row={Math.floor(i / numColumns)}
        onClick={() => props.onClick(clue)}
      />);
  }
  return (
    <div className="wall">
      {tiles}
    </div>
  );
}

export default Wall;
