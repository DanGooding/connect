
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { numGroups, numBonusPoints } from './constants.js';
import { pluralise } from './utils.js';

function Results(props) {
  let score = props.numFoundGroups + props.numCorrectConnections;
  let bonus;
  if (props.numFoundGroups === numGroups && props.numCorrectConnections === numGroups) {
    bonus = <Fragment>{numBonusPoints} bonus</Fragment>;
    score += numBonusPoints;
  }
  return (
    <div className="results">
      {props.numFoundGroups} {pluralise('group', props.numFoundGroups)} found
      <br/>
      {props.numCorrectConnections} {pluralise('connection', props.numCorrectConnections)}
      <br/>
      {bonus}
      <hr/>
      {score}
    </div>
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
