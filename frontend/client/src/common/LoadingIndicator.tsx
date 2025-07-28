
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './LoadingIndicator.css';

type LoadingIndicatorState = {
  showSpinner: boolean
};

class LoadingIndicator extends React.Component<any, LoadingIndicatorState> {
  timeoutId: number|undefined;
  state: LoadingIndicatorState = {
    showSpinner: false
  };

  componentDidMount() {
    this.timeoutId = window.setTimeout(
      () => this.setState({showSpinner: true}), 
      500);
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeoutId);
  }

  render() {
    if (!this.state.showSpinner) return null;
    return (
      <div className="loading-indicator">
        <FontAwesomeIcon icon={faSpinner} size="2x" pulse />
        <div className="loading-label">Loading...</div>
      </div>
    );
  }
}

export default LoadingIndicator;
