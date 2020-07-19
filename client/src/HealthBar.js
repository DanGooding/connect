
import React from 'react';
import PropTypes from 'prop-types';

function HealthBar(props) {
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

HealthBar.propTypes = {
  // the current number of lives
  lives: PropTypes.number.isRequired,
  // the total number of life symbols shown
  maxLives: PropTypes.number.isRequired
}

export default HealthBar;
