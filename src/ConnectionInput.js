
import React from 'react';
import PropTypes from 'prop-types';

class ConnectionInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guess: ""
    };
  }

  handleChange(event) {
    this.setState({
      guess: event.target.value
    });
  }

  render() {
    let className = `connection-input group_${this.props.groupNumber}`;
    return (
      <div className={className}>
        Group {this.props.groupNumber + 1}
        <br/>
        <label>What is the connection?</label>
        <input type="text" value={this.state.guess} onChange={this.handleChange.bind(this)} />
      </div>
    );
    // TODO: textarea instead? - just a looong text box
  }
}

ConnectionInput.propTypes = {
  // when this group was found 0=first, 1=second etc.
  groupNumber: PropTypes.number.isRequired,
  // the expected answer
  connection: PropTypes.string.isRequired
};

export default ConnectionInput;
