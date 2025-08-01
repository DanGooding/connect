
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NavBar from './NavBar';
import HomePage from '../home/HomePage';
import GameFetcher from '../game/GameFetcher';
import RandomGameFetcher from '../game/RandomGameFetcher';
import './App.css';

function App() {
  return (
    <>
      <NavBar />
      <div className="content">
        <Switch>
          <Route path="/walls/random">
            <RandomGameFetcher />
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
