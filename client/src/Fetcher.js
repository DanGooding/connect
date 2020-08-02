
import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from './LoadingIndicator.js';
import ErrorMessage from './ErrorMessage.js';

class Fetcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // true if request has completed successfully
      isLoaded: false,
      // { message, code } when request has failed
      fetchError: null,
      // the response data transformed into the props to pass to the component
      props: null
    };
  }

  componentDidMount() {
    fetch(this.props.url)
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
          .then(data =>
            this.setState({
              isLoaded: true,
              props: 
                this.props.buildProps == null 
                  ? data
                  : this.props.buildProps(data) 
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
      return (
        <ErrorMessage 
          code={this.state.fetchError.code} 
          message={this.state.fetchError.message} 
        />
      );
    }else if (!this.state.isLoaded) {
      return <LoadingIndicator />;
    }

    const Component = this.props.component;
    return <Component {...this.state.props}/>;
  }
}

Fetcher.propTypes = {
  // the type of the component to render once fetched
  // i.e. MyComponent for <MyComponent />
  component: PropTypes.elementType.isRequired,
  // where to fetch from
  url: PropTypes.string.isRequired,
  // takes the response data (parsed from json)
  // and produces an object with the props to pass to the component
  // if not present, the data is spread directly into props
  buildProps: PropTypes.func
};

export default Fetcher;
