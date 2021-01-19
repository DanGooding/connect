
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as fasFaHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farFaHeart } from '@fortawesome/free-regular-svg-icons';
import './HealthBar.css';

type HealthBarProps = {
  // the current number of lives
  lives: number,
  // the total number of life symbols shown
  maxLives: number
};

function HealthBar(props: HealthBarProps) {
  let lives = [];
  for (let i = 0; i < props.maxLives; i++) {
    if (i < props.lives) {
      lives.push(<FontAwesomeIcon icon={fasFaHeart} size="lg" className="life" key={i} />);
    }else {
      lives.push(<FontAwesomeIcon icon={farFaHeart} size="lg" className="lost-life" key={i} />);
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
