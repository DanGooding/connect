
import React from 'react';
import WallListItem from './WallListItem.js';
import './WallList.css';

class WallList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      fetchError: null,
      walls: null
    };
  }

  componentDidMount() {
    // TODO extract as a util
    fetch('/api/walls')
      .then(res => {
        if (!res.ok) {
          res.json()
            .then(({error}) => 
              this.setState({fetchError: error})
            );
          return;
        }
        res.json()
          .then(walls =>
            this.setState({
              isLoaded: true,
              walls
            }));
      })
      .catch(error =>
        this.setState({
          fetchError: `fetch error: ${error.message}`
        })
      );
  }

  render() {
    // TODO: classNames 
    if (this.state.fetchError != null) {
      return <div>Error: {this.state.fetchError}</div>;
    }else if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    }

    // TODO: change _id to id in api ?
    const items = this.state.walls.map(wall => 
      <WallListItem 
        key={wall._id} id={wall._id} 
        series={wall.series} episode={wall.episode} 
        symbolName={wall.symbolName} 
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
