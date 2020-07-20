
import React from 'react';
import PropTypes from 'prop-types';
import { numGroups, numBonusPoints } from './constants.js';
import { pluralise } from './utils.js';
import './Results.css';

function Results(props) {
  let score = props.numFoundGroups + props.numCorrectConnections;
  let bonus;
  if (props.numFoundGroups === numGroups && props.numCorrectConnections === numGroups) {
    bonus = (
      <tr>
        <td className="result-value">+{numBonusPoints}</td>
        <td className="result-description">bonus</td>
      </tr>
    );
    score += numBonusPoints;
  }
  // colgroups for value & description
  return (
    <table className="results-table">
      <tbody>
        <tr>
          <td className="result-value">{props.numFoundGroups}</td>
          <td className="result-description">{pluralise('group', props.numFoundGroups)} found</td>
        </tr>
        <tr>
          <td className="result-value">+{props.numCorrectConnections}</td>
          <td className="result-description">{pluralise('connection', props.numCorrectConnections)} found</td>
        </tr>
        {bonus}
        <tr className="result-total-row">
          <td className="result-value">{score}</td>
          <td className="result-description">{pluralise('point', score)}</td>
        </tr>
      </tbody>
    </table>
  );
  // TODO: also num lives remaining & time
}

Results.propTypes = {
  // how many groups were found
  numFoundGroups: PropTypes.number,
  // how many connections were correct
  numCorrectConnections: PropTypes.number,
};

export default Results;
