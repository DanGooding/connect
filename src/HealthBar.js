
import React from 'react';

function HealthBar(props) {
  // props.lives - number of remaining lives
  // props.maxLives - number of spaces to be shown
  let lives = [];
  for (let i = 0; i < props.maxLives; i++) {
    if (i < props.lives) {
      lives.push(<span key={i} aria-label="life" role="img">💙</span>);
    }else {
      lives.push(<span key={i} aria-label="lost life" role="img">🤍</span>);
    }
  }
  return <div className="health-bar">{lives}</div>;
}

export default HealthBar;
