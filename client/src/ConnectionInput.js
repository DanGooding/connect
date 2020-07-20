
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

class ConnectionInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guess: "",
      answerShown: false
    };
    this.handleChangeGuess = this.handleChangeGuess.bind(this);
    this.checkGuess = this.checkGuess.bind(this);
    this.handleChangeCorrectness = this.handleChangeCorrectness.bind(this);
  }

  handleChangeGuess(event) {
    if (this.state.answerShown) return; // TODO: remove?
    this.setState({
      guess: event.target.value
    });
  }

  checkGuess(event) {
    // prevent button click from submitting form
    event.preventDefault();
    if (this.state.guess === '') return;
    // TODO: fuzzy string comparison
    const answerCorrect = this.state.guess.toLowerCase() === this.props.connection.toLowerCase();
    this.setState({
      answerShown: true,
    });
    // TODO: duplication
    this.props.onChangeCorrectness(this.props.groupNumber, answerCorrect);
  }

  handleChangeCorrectness(event) {
    this.props.onChangeCorrectness(this.props.groupNumber, event.target.value === "correct");
  }

  render() {
    const className = `connection-input group group-${this.props.groupNumber}`;

    let checkButton;
    if (!this.state.answerShown) {
      checkButton = <button onClick={this.checkGuess}>Check</button>;
    }

    let answer;
    if (this.state.answerShown) {
      const radioName = `group_${this.props.groupNumber}_correct`;

      // TODO: use <p> to group ?
      answer = (
        <Fragment>
          <br/>
          The connection is: <span className="connection-answer">{this.props.connection}</span>
          <br/>
          Were you right?
          <br/>
          <label>
            <input 
              type="radio" name={radioName} 
              checked={this.props.answerCorrect} 
              onChange={this.handleChangeCorrectness}
              value="correct" />
            Correct ✅
          </label>
          <br/>
          <label>
            <input 
              type="radio" name={radioName} 
              checked={!this.props.answerCorrect} 
              onChange={this.handleChangeCorrectness}
              value="incorrect" />
            Incorrect ❌
          </label>
        </Fragment>
      );
    }

    return (
      <form className={className} onSubmit={() => {}}>
        <h2>Group {this.props.groupNumber + 1}</h2>

        <label>What is the connection?</label>
        <input 
          type="text" 
          value={this.state.guess} 
          onChange={this.handleChangeGuess} 
          disabled={this.state.answerShown} 
        />
        {checkButton}

        {answer}

      </form>
    );
    // TODO: textarea instead? - just a looong text box
  }
}

ConnectionInput.propTypes = {
  // when this group was found 0=first, 1=second etc.
  groupNumber: PropTypes.number.isRequired,
  // the expected answer
  connection: PropTypes.string.isRequired,
  // whether the current answer is correct
  answerCorrect: PropTypes.bool,
  // callback to change whether this clue is marked as correct
  onChangeCorrectness: PropTypes.func,
};

export default ConnectionInput;
