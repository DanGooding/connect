
import React from 'react';
import PropTypes from 'prop-types';
import { numGroups, numBonusPoints } from '../common/constants';
import { pluralise } from '../common/utils';
import './Results.css';

type ResultsProps = {
  // how many groups were found
  numFoundGroups: number,
  // how many connections were correct
  numCorrectConnections: number
};

function Results(props: ResultsProps) {
  let score = props.numFoundGroups + props.numCorrectConnections;
  let addBonusPoints = false;
  if (props.numFoundGroups === numGroups && props.numCorrectConnections === numGroups) {
    addBonusPoints = true;
    score += numBonusPoints;
  }
  return (
    <div className="results-wrapper">
      <div className="results">
        <h2 className="results-title">Results</h2>
        <div className="results-content">
          <div className="results-grid">

            <span className="result-value">{props.numFoundGroups}</span>
            <span className="result-description">{pluralise('group', props.numFoundGroups)} found</span>
            
            <span className="result-plus">+</span>
            <span className="result-value">{props.numCorrectConnections}</span>
            <span className="result-description">{pluralise('connection', props.numCorrectConnections)} found</span>
            
            {addBonusPoints &&
              <>
                <span className="result-plus">+</span>
                <span className="result-value">{numBonusPoints}</span>
                <span className="result-description">bonus</span>
              </>
            }

            <hr className="result-underline" />

            <span className="result-value">{score}</span>
            <span className="result-description">{pluralise('point', score)}</span>
          </div>
        </div>
      </div>
    </div>
  );
  // TODO: 'well done!' message?
  // TODO: also num lives remaining & time
}

Results.propTypes = {
  numFoundGroups: PropTypes.number,
  numCorrectConnections: PropTypes.number,
};

export default Results;
