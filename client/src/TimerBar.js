
import React from 'react';
import PropTypes from 'prop-types';
import './TimerBar.css';

function TimerBar(props) {
  // TODO: storing state in the DOM like this is bad
  return (
    <div className="timer-bar">
      <div 
        className="timer-bar-inner"
        style={{
          animation: `grow ${props.duration}s linear`,
          animationPlayState: props.paused ? "paused" : "running"
        }}
        onAnimationEnd={props.onFinish}
      />
    </div>
  );
}

TimerBar.propTypes = {
  // how long to take
  duration: PropTypes.number.isRequired,
  // is the timer counting down
  paused: PropTypes.bool,
  // callback for when the time runs out
  onFinish: PropTypes.func.isRequired
};

export default TimerBar;
