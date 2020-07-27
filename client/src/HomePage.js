
import React from 'react';
import WallList from './WallList';
import './HomePage.css';

function HomePage(props) {
  return (
    <div className="home-container">
      <h1 className="home-title">Connect</h1>
      <WallList />
    </div>
  );
}

export default HomePage;
