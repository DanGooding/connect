
import React from 'react';
import PropTypes from 'prop-types';
import ConnectionInput from './ConnectionInput.js';
import { numGroups } from './constants.js';

class ConnectionsForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let inputs = this.props.groupIndices.map(
      (groupIndex, i) => 
        <ConnectionInput key={i} groupNumber={i} connection={this.props.connections[groupIndex]} />);

    let resolveButton; 
    if (this.props.groupIndices.length < numGroups) {
      resolveButton = <button onClick={this.props.resolveWall}>Resolve wall</button>;
    }
    // TODO: actual action once complete
    // or have (next) button in GamePage
    return <form onSubmit={() => {}}>
      {inputs}
      {resolveButton}
    </form>;
  }
}

ConnectionsForm.propTypes = {
  // indices of the groups to display inputs for
  groupIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
  // connections for all groups. groupIndices index into here
  connections: PropTypes.arrayOf(PropTypes.string).isRequired,
  // function to reveal remaining groups
  resolveWall: PropTypes.func.isRequired

  // TODO: callback
};

export default ConnectionsForm;
