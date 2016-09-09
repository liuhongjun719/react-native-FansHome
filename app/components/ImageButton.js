
import React, { PropTypes } from 'react';
import {
  View,
  Image,
  TouchableOpacity
} from 'react-native';

const propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  source: PropTypes.oneOfType([
    PropTypes.shape({
      uri: PropTypes.string,
    }),
    PropTypes.number,
  ]),
  style: View.propTypes.style,
  containerStyle: View.propTypes.style
};

const ImageButton = ({ onPress, disabled, source, style, containerStyle }) => (
  <TouchableOpacity
    style={containerStyle}
    onPress={onPress}
    disabled={disabled}
  >
    <Image
      style={style}
      source={source}
    />
  </TouchableOpacity>
);

ImageButton.propTypes = propTypes;

ImageButton.defaultProps = {
  onPress() {},
  disabled: false
};

export default ImageButton;
