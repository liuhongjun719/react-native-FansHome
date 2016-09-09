
import React from 'react';
import { connect } from 'react-redux';
import Main from '../pages/Main';


class MainContainer extends React.Component {
  componentDidMount() {

  }

  render() {
    return (
      <Main {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const { read } = state;
  return {
    read
  };
}

export default connect(mapStateToProps)(MainContainer);
