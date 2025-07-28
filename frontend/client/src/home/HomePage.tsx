
import React from 'react';
import './HomePage.css';
import WallListFetcher from './WallListFetcher';

function HomePage() {
  return (
    <div className="home-container">
      <div className="home-description">
        <h1 className="home-title">Connect</h1>
        <p>An unofficial, fan made site to play some of the connecting walls from the quiz show Only Connect.</p>
        <p>
          Each wall has 16 jumbled up clues, that need to be sorted into 4 connected groups of 4.
          You have 2:30 to find all the groups, but once only two remain you'll have three lives, 
          so be careful of red herrings!
        </p>
        <p>These questions are taken from <a href="https://ocdb.cc/">The Only Connect Database</a></p>
      </div>
      <WallListFetcher />
    </div>
  );
}

export default HomePage;
