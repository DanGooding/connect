
import React from 'react';
import PropTypes from 'prop-types';
import Tile from './Tile';
import { numColumns } from '../common/constants';
import './Wall.css';

type WallProps = {
  // all clues, in the order they appear in the DOM.
  // this is unchanged even when clueOrder changes, so the css transitions work correctly
  clues: string[],
  // all clues specified left to right, top to bottom
  clueOrder: string[],
  // the selected clues
  selection: Set<string>,
  // the groups found so far, in order of discovery each group is a Set of clues
  foundGroups: Array<Set<string>>,
  // if truthy, click input is ignored
  frozen: boolean,
  // callback when a tile is clicked
  onTileClick: (clue: string) => void
};

function Wall(props: WallProps) {
  const tiles = [];
  for (const clue of props.clues) {
    const i = props.clueOrder.indexOf(clue);

    let clickable = false;
    let group: number | null = props.foundGroups.findIndex(group => group.has(clue));
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
    clues: PropTypes.arrayOf(PropTypes.string).isRequired,
    clueOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
    selection: PropTypes.instanceOf(Set),
    foundGroups: PropTypes.arrayOf(PropTypes.instanceOf(Set)).isRequired,
    frozen: PropTypes.bool,
    onTileClick: PropTypes.func.isRequired,
}

export default Wall;
