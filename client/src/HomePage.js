
import React from 'react';
import './HomePage.css';
import WallListFetcher from './WallListFetcher';

function HomePage() {
  return (
    <div className="home-container">
      <h1 className="home-title">Connect</h1>
      <WallListFetcher />
    </div>
  );
}

export default HomePage;
