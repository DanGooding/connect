
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import './ErrorMessage.css';

function ErrorMessage(props) {
  // TODO: retry option
  return (
    <div className="error-message">
      <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
      <h2>Error {props.code}</h2>
      <p>{props.message}</p>
    </div>
  );
}

ErrorMessage.propTypes = {
  // http status code, if applicable
  code: PropTypes.number,
  // description of the problem in user language
  message: PropTypes.string.isRequired
};

export default ErrorMessage;
