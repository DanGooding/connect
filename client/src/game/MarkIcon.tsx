
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

type MarkIconProps = {
  correct: boolean,
  onClick: React.MouseEventHandler
}

function MarkIcon(props: MarkIconProps) {
  return (
    <span onClick={props.onClick} style={{textAlign: "center"}}>
      {props.correct
        ? <FontAwesomeIcon icon={faCheck} size="lg" color="green"/>
        : <FontAwesomeIcon icon={faTimes} size="lg" color="red" />
      }
    </span>
  );
  ;
}

MarkIcon.propTypes = {
  // should a tick or cross be rendered
  correct: PropTypes.bool,
  // callback
  onClick: PropTypes.func
};

export default MarkIcon;
