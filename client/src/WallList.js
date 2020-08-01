
import React from 'react';
import WallListItem from './WallListItem.js';
import LoadingIndicator from './LoadingIndicator.js';
import './WallList.css';
import ErrorMessage from './ErrorMessage.js';

class WallList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      // error returned from the api request { code, message }
      fetchError: null,
      walls: null
    };
  }

  componentDidMount() {
    // TODO extract as a util
    fetch('/api/walls')
      // got response
      .then(res => {
        if (!res.ok) {
          res.json()
            // api responded with error message
            .then(({error}) => 
              this.setState({fetchError: {code: res.status, message: error}})
            )
            // didn't get through to api server
            .catch(() => {
              this.setState({fetchError: {code: res.status, message: res.statusText}})
            });
          return;
        }
        res.json()
          // successful response from api
          .then(walls =>
            this.setState({
              isLoaded: true,
              walls
            }));
      })
      // network failure
      .catch(error =>
        this.setState({
          fetchError: {
            // code: ?
            message: 'Network disconnected'
          }
        })
      );
  }

  render() {
    if (this.state.fetchError != null) {
      return <ErrorMessage code={this.state.fetchError.code} message={this.state.fetchError.message} />;
    }else if (!this.state.isLoaded) {
      return <LoadingIndicator />;
    }

    // TODO: change _id to id in api ?
    const items = this.state.walls.map(wall => 
      <WallListItem 
        key={wall._id} id={wall._id} 
        series={wall.series} episode={wall.episode} 
        symbol={wall.symbolName} 
      />);

    return (
      <div>
        <ul className="wall-list">
          {items}
        </ul>
      </div>
    );
  }
}

export default WallList;
