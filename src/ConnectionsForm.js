
import React from 'react';
import PropTypes from 'prop-types';
import ConnectionInput from './ConnectionInput.js';
import { numGroups } from './constants.js';

function ConnectionsForm(props) {
  let inputs = props.groupIndices.map(
    (groupIndex, i) =>
      <ConnectionInput key={i} groupNumber={i} connection={props.connections[groupIndex]} />);

  let resolveButton;
  if (props.groupIndices.length < numGroups) {
    resolveButton = <button onClick={props.resolveWall}>Resolve wall</button>;
  }
  // TODO: actual action once complete, or have (next) button in GamePage
  return (
    <div className="connections-form">
      {inputs}
      {resolveButton}
    </div>
  );
  // TODO: only allow submit & finish once all groups have been marked
}

ConnectionsForm.propTypes = {
  // indices of the groups to display inputs for (in the order to display)
  groupIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
  // connections for all groups. groupIndices index into here
  connections: PropTypes.arrayOf(PropTypes.string).isRequired,
  // function to reveal remaining groups
  resolveWall: PropTypes.func.isRequired

  // TODO: callback
};

export default ConnectionsForm;
