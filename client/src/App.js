
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import GameWall from './GameWall.js';
import HomePage from './HomePage.js';
import './App.css';

function App() {
  // TODO: navignation - home button
  return (
    <Switch>
      <Route path="/walls/:id">
        <GameWall />
      </Route>
      <Route path="/">
        <HomePage />
      </Route>
    </Switch>
  );
}

export default App;
