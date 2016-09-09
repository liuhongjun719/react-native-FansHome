
import React from 'react';
import {
  Dimensions,
  Image
} from 'react-native';

import MainContainer from '../containers/MainContainer';

const maxHeight = Dimensions.get('window').height;
const maxWidth = Dimensions.get('window').width;

class Launch extends React.Component {
  componentDidMount() {
    const { navigator } = this.props;
    this.timer = setTimeout(() => {
      navigator.resetTo({
        component: MainContainer,
        name: 'Main'
      });
    }, 2000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    return (
      <Image
        source={{uri: 'launch.png', height: maxHeight, width: maxWidth}}
      />
    );
  }
}

export default Launch;
