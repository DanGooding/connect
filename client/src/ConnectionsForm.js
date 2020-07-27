
import React from 'react';
import PropTypes from 'prop-types';
import ConnectionInput from './ConnectionInput.js';
import { numGroups } from './constants.js';
import './ConnectionsForm.css';

function ConnectionsForm(props) {

  const onChangeCorrectness = (i, newCorrectness) =>
    props.onChangeCorrectness(props.groupIndices[i], newCorrectness);

  const inputs = props.groupIndices.map(
    (groupIndex, i) =>
      <ConnectionInput 
        key={i} groupNumber={i} 
        connection={props.connections[groupIndex]} 
        answerCorrect={props.answersCorrect[groupIndex]}
        onChangeCorrectness={onChangeCorrectness}
      />
  );

  let resolveButton;
  if (props.groupIndices.length < numGroups) {
    resolveButton = <button className="centered-button" onClick={props.resolveWall}>Resolve wall</button>;
  }
  return (
    <div className="connections-form">
      {inputs}
      {resolveButton}
    </div>
  );
}

ConnectionsForm.propTypes = {
  // indices of the groups to display inputs for (in the order to display)
  groupIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
  // connections for all groups. groupIndices index into here
  connections: PropTypes.arrayOf(PropTypes.string).isRequired,
  // whether the given connection for each group is correct
  answersCorrect: PropTypes.arrayOf(PropTypes.bool).isRequired,
  // function to reveal remaining groups
  resolveWall: PropTypes.func.isRequired
};

export default ConnectionsForm;
