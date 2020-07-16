
import React from 'react';
import Game from './Game.js';

function App() {
  const clues = [
    "A1", "A2", "A3", "A4",
    "B1", "B2", "B3", "B4",
    "C1", "C2", "C3", "C4",
    "D1", "D2", "D3", "D4",
  ];
  const groups = [
    new Set(["A1", "A2", "A3", "A4"]), 
    new Set(["B1", "B2", "B3", "B4"]), 
    new Set(["C1", "C2", "C3", "C4"]), 
    new Set(["D1", "D2", "D3", "D4"])];
  // TODO **** game doesn't respond to changes in props!! - anti pattern?
  // TODO: just take groups & build clues from there
  return <Game clues={clues} groups={groups}/>;
}

export default App;
