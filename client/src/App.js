
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import GameFetcher from './GameFetcher.js';
import HomePage from './HomePage.js';
import './App.css';

function App() {
  // TODO: navignation - home button
  return (
    <Switch>
      <Route path="/walls/:id">
        <GameFetcher />
      </Route>
      <Route path="/">
        <HomePage />
      </Route>
    </Switch>
  );
}

export default App;
