
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import './ErrorMessage.css';

type ErrorMessageProps = {
  // http status code, if applicable
  message: string,
  // description of the problem in user language
  code?: number
};

function ErrorMessage(props: ErrorMessageProps) {
  return (
    <div className="error-message">
      <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
      <h2>Error {props.code}</h2>
      <p>{props.message}</p>
    </div>
  );
}

export default ErrorMessage;
