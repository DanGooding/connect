
import React from 'react';
import PropTypes from 'prop-types';
import ConnectionInput from './ConnectionInput';
import { numGroups } from '../common/constants';
import './ConnectionsForm.css';

type ConnectionsFormProps = {
  groupIndices: number[],
  connections: string[],
  answerMarks: (boolean | null | undefined)[],
  resolveWall: React.MouseEventHandler,
  finishGame: React.MouseEventHandler,
  onChangeCorrectness: (i: number, newCorrectness: boolean) => void
};

function ConnectionsForm(props: ConnectionsFormProps) {

  const onChangeCorrectness = (i: number, newCorrectness: boolean) =>
    props.onChangeCorrectness(props.groupIndices[i], newCorrectness);

  const inputs = props.groupIndices.map(
    (groupIndex, i) =>
      <ConnectionInput 
        key={i} groupNumber={i} 
        connection={props.connections[groupIndex]} 
        answerCorrect={props.answerMarks[groupIndex]}
        onChangeCorrectness={onChangeCorrectness}
      />
  );

  return (
    <div className="connections-form">
      {inputs}
      {props.groupIndices.length < numGroups &&
        <button className="wide-button" onClick={props.resolveWall}>
          Resolve wall
        </button>
      }
      {props.answerMarks.every(x => x != null) &&
        <button className="wide-button" onClick={props.finishGame}>
          Done
        </button>
      }
    </div>
  );
}

ConnectionsForm.propTypes = {
  // indices of the groups to display inputs for (in the order to display)
  groupIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
  // connections for _all_ groups. groupIndices index into here
  connections: PropTypes.arrayOf(PropTypes.string).isRequired,
  // whether the given connection for each group is correct
  answerMarks: PropTypes.arrayOf(PropTypes.bool).isRequired,
  // function to reveal remaining groups
  resolveWall: PropTypes.func.isRequired,
  // function to call once all connections have been marked
  finishGame: PropTypes.func.isRequired
};

export default ConnectionsForm;
