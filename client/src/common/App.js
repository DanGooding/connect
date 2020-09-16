
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NavBar from './NavBar.js';
import HomePage from '../home/HomePage.js';
import GameFetcher from '../game/GameFetcher.js';
import RandomGameRedirect from '../home/RandomGameRedirect.js';
import './App.css';

function App() {
  return (
    <>
      <NavBar />
      <div className="content">
        <Switch>
          <Route path="/walls/random">
            <RandomGameRedirect />
          </Route>
          <Route path="/walls/:id">
            <GameFetcher />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </div>
    </>
  );
}

export default App;
