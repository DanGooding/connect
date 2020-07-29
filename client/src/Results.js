
import React from 'react';
import PropTypes from 'prop-types';
import { numGroups, numBonusPoints } from './constants.js';
import { pluralise } from './utils.js';
import './Results.css';

function Results(props) {
  let score = props.numFoundGroups + props.numCorrectConnections;
  let addBonusPoints = false;
  if (props.numFoundGroups === numGroups && props.numCorrectConnections === numGroups) {
    addBonusPoints = true;
    score += numBonusPoints;
  }
  return (
    <div className="results">
      <h2 className="results-title">Results</h2>
      <div className="results-content">
        <table className="results-table">
          <tbody>
            <tr>
              <td className="result-value">{props.numFoundGroups}</td>
              <td className="result-description">{pluralise('group', props.numFoundGroups)} found</td>
            </tr>
            <tr>
              <td className="result-value">+ {props.numCorrectConnections}</td>
              <td className="result-description">{pluralise('connection', props.numCorrectConnections)} found</td>
            </tr>
            {addBonusPoints &&
              <tr>
                <td className="result-value">+ {numBonusPoints}</td>
                <td className="result-description">bonus</td>
              </tr>
            }
            <tr className="result-total-row">
              <td className="result-value">{score}</td>
              <td className="result-description">{pluralise('point', score)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
  // TODO: 'well done!' message?
  // TODO: also num lives remaining & time
}

Results.propTypes = {
  // how many groups were found
  numFoundGroups: PropTypes.number,
  // how many connections were correct
  numCorrectConnections: PropTypes.number,
};

export default Results;
