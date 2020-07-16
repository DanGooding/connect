
import React from 'react';
import Tile from './Tile.js';
import { numColumns, groupSize } from './constants.js';
import './style.css';

class Wall extends React.Component {
  constructor(props) {
    super(props);
    // this.props.clues - array of all clues, in the order they appear in the DOM this is fixed even when this.props.clueOrder changes, so the css transitions work correctly
    // this.props.clueOrder - array of all clues specified left to right, top to bottom
    // this.props.foundGroups - array of the groups found so far, in order of discovery each group is a Set of clues
    // this.props.frozen - if truthy, input is ignored
    // this.props.handleGuess - given a guess, updates game state, returns true if correct

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
          this.props.handleGuess(this.state.selected, 
            () => this.setState({selected: new Set()}));
        }
      });
    }
  }

  render() {
    const tiles = [];
    for (const clue of this.props.clues) {
      const i = this.props.clueOrder.indexOf(clue);

      let group = this.props.foundGroups.findIndex(group => group.has(clue));
      if (group === -1) group = null;

      tiles.push(
        <Tile
          clue={clue}
          key={clue}
          selected={this.state.selected.has(clue)}
          group={group}
          column={i % numColumns} row={Math.floor(i / numColumns)}
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

export default Wall;
