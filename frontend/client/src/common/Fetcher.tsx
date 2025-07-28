
import React from 'react';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';

type FetcherProps = {
  // the type of the component to render once fetched
  // i.e. MyComponent for <MyComponent />
  component: any, // PropTypes.elementType.isRequired,
  // where to fetch from
  url: string,
  // takes the response data (parsed from json)
  // and produces an object with the props to pass to the component
  // if not present, the data is spread directly into props
  buildProps: (data: any) => any
};

type FetcherState = {
  isLoaded: boolean,
  fetchError: { message: string, code?: number } | null,
  props: any
};

class Fetcher extends React.Component<FetcherProps, FetcherState> {
  state: FetcherState = {
    // true if request has completed successfully
    isLoaded: false,
    // { message, code } when request has failed
    fetchError: null,
    // the response data transformed into the props to pass to the component
    props: null
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
            // TODO: avoid setting state after unmount
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

export default Fetcher;
