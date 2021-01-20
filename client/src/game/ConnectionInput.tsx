
import React from 'react';
import PropTypes from 'prop-types';
import MarkIcon from './MarkIcon';
import markConnectionGuess from './markConnectionGuess';

const maxGuessLength = 100;

type ConnectionInputProps = {
  // when this group was found 0=first, 1=second etc.
  groupNumber: number,
  // the expected answer
  connection: string,
  // whether the current answer is correct
  answerCorrect: boolean | null | undefined,
  // callback to change whether this clue is marked as correct
  onChangeMark: (groupNumber: number, newMark: boolean) => void
};

type ConnectionInputState = {
  guess: string,
  answerShown: boolean
};

class ConnectionInput extends React.Component<ConnectionInputProps, ConnectionInputState> {
  static propTypes = {
    groupNumber: PropTypes.number.isRequired,
    connection: PropTypes.string.isRequired,
    answerCorrect: PropTypes.bool,
    onChangeMark: PropTypes.func,
  };

  state: ConnectionInputState = {
    guess: "",
    answerShown: false
  };

  constructor(props: ConnectionInputProps) {
    super(props);
    this.handleChangeGuess = this.handleChangeGuess.bind(this);
    this.checkGuess = this.checkGuess.bind(this);
    this.handleChangeMark = this.handleChangeMark.bind(this);
    this.setMark = this.setMark.bind(this);
  }

  handleChangeGuess(event: React.ChangeEvent<HTMLInputElement>) {
    if (this.state.answerShown) return; // TODO: remove?
    this.setState({
      guess: event.target.value.substring(0, maxGuessLength)
    });
  }

  checkGuess(event: React.MouseEvent) {
    // prevent button click from submitting form
    event.preventDefault();
    // prevent accidental marking
    if (this.state.guess === '') return;

    this.setMark(markConnectionGuess(this.state.guess, this.props.connection));
    this.setState({
      answerShown: true,
    });
  }

  handleChangeMark(event: React.ChangeEvent<HTMLInputElement>) {
    this.setMark(event.target.value === "correct");
  }

  setMark(correct: boolean) {
    this.props.onChangeMark(this.props.groupNumber, correct);
  }

  render() {
    // name of the set of radio inputs, unique in the page
    const radioName = `group_${this.props.groupNumber}_correct`;

    return (
      <form className="connection-input" onSubmit={e => e.preventDefault()}>
        <h2 className={`connection-title group-${this.props.groupNumber}`}>Group {this.props.groupNumber + 1}</h2>

        <div className="connection-input-wrapper">
          <div className="connection-input-grid">
            <label className="connection-input-label">Connection</label>
            <input 
              className="connection-input-textbox"
              type="text" 
              value={this.state.guess} 
              onChange={this.handleChangeGuess} 
              disabled={this.state.answerShown} 
            />
            {!this.state.answerShown &&
              <button className="connection-check" onClick={this.checkGuess}>Check</button>
            }

            {this.state.answerShown &&
              <>
                <MarkIcon 
                  correct={this.props.answerCorrect || false} 
                  onClick={() => this.setMark(!this.props.answerCorrect)}
                />

                <span className="connection-input-label">Answer</span>
                <span className="connection-answer">{this.props.connection}</span>
                
                <span></span>
                <span className="connection-input-label">Mark it:</span>

                <div className="connection-correct-radio">

                  <label htmlFor={`radio_${radioName}_correct`}>Correct</label>
                  <input 
                    type="radio" name={radioName} 
                    id={`radio_${radioName}_correct`}
                    checked={this.props.answerCorrect || false} 
                    onChange={this.handleChangeMark}
                    value="correct"
                  />
                  <label htmlFor={`radio_${radioName}_incorrect`}>Incorrect</label>
                  <input 
                    type="radio" name={radioName} 
                    id={`radio_${radioName}_incorrect`}
                    checked={!this.props.answerCorrect} 
                    onChange={this.handleChangeMark}
                    value="incorrect"
                  />
                </div>
              </>
            }
          </div>
        </div>
      </form>
    );
  }
}

export default ConnectionInput;
