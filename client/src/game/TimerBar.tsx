
import React from 'react';
import PropTypes from 'prop-types';
import './TimerBar.css';

type TimerBarProps = {
  // how long to take
  duration: number,
  // is the timer counting down
  paused: boolean,
  // callback for when the time runs out
  onFinish: React.AnimationEventHandler
};

function TimerBar(props: TimerBarProps) {
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
  duration: PropTypes.number.isRequired,
  paused: PropTypes.bool,
  onFinish: PropTypes.func.isRequired
};

export default TimerBar;
