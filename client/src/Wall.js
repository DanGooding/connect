
import React from 'react';
import PropTypes from 'prop-types';
import Tile from './Tile.js';
import { numColumns, groupSize } from './constants.js';
import './Wall.css';

class Wall extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // the selected clues
      selected: new Set()
    };
  }

  tileClicked(clue) {
    if (this.props.frozen) return;
    if (this.state.selected.size === groupSize) return;  // TODO: this is a hack

    let newSelected = new Set(this.state.selected);

    if (this.state.selected.has(clue)) { // deselect this clue
      // TODO: delay
      newSelected.delete(clue);
      this.setState({selected: newSelected});
      
    }else { // select this clue
      newSelected.add(clue);
      this.setState({selected: newSelected}, () => {
        if (this.state.selected.size === groupSize) {
          this.props.onGuess(this.state.selected, 
            () => this.setState({selected: new Set()}));
        }
      });
    }
  }

  render() {
    const tiles = [];
    for (const clue of this.props.clues) {
      const i = this.props.clueOrder.indexOf(clue);

      let clickable = false;
      let group = this.props.foundGroups.findIndex(group => group.has(clue));
      if (group === -1) {
        group = null;
        clickable = true;
      }

      if (this.state.selected.has(clue)) {
        group = this.props.foundGroups.length;
      }

      tiles.push(
        <Tile
          clue={clue}
          key={clue}
          group={group}
          column={i % numColumns} row={Math.floor(i / numColumns)}
          clickable={clickable}
          onClick={() => this.tileClicked(clue)}
        />);
    }
    return (
      <div className="wall">
        {tiles}
      </div>
    );
  }
}

Wall.propTypes = {
    // all clues, in the order they appear in the DOM.
    // this is unchanged even when clueOrder changes, so the css transitions work correctly
    clues: PropTypes.arrayOf(PropTypes.string).isRequired,
    // all clues specified left to right, top to bottom
    clueOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
    // the groups found so far, in order of discovery each group is a Set of clues
    foundGroups: PropTypes.arrayOf(PropTypes.instanceOf(Set)).isRequired,
    // if truthy, click input is ignored
    frozen: PropTypes.bool,
    // given a guess, updates game state, returns true if correct
    onGuess: PropTypes.func.isRequired,
}

export default Wall;
