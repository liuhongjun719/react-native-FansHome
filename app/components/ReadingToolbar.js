
import React, { PropTypes } from 'react';
import {
	StyleSheet,
	ToolbarAndroid,
	Platform,
	View,
	Text
} from 'react-native';

import { naviGoBack } from '../utils/CommonUtil';
import ImageButton from './ImageButton';
import Button from './Button';
import Icon from 'react-native-vector-icons/FontAwesome';



let showActionButton = false;
const iconLeft = require('../img/icon_left.png');
const iconLeftIOS = require('../img/icon_left_ios.png');

const propTypes = {
  title: PropTypes.string,
  actions: PropTypes.array,
  navigator: PropTypes.object,
  onActionSelected: PropTypes.func,
  onIconClicked: PropTypes.func,
  navIcon: PropTypes.number,
};

const ReadingToolbar = ({
  title,
  actions,
  navigator,
  onActionSelected,
  onIconClicked,
  navIcon
}) => {
  const handleIconClicked = () => {
    if (onIconClicked) {
      onIconClicked();
    } else if (navigator) {
      naviGoBack(navigator);
    }
  };

  const renderToolbarAndroid = () => (
    <ToolbarAndroid
      style={styles.toolbar}
      actions={actions}
      onActionSelected={onActionSelected}
      onIconClicked={handleIconClicked}
      navIcon={navIcon === undefined ? iconLeft : navIcon}
      titleColor="#fff"
      title={title}
    />
  );

  const renderToolbarIOS = () => {
    const action = actions[0];
    showActionButton = action !== undefined;
    return (
      <View style={styles.toolbar}>
        <ImageButton
          containerStyle={{ justifyContent: 'center', alignItems: 'center' }}
          source={navIcon === undefined ? iconLeftIOS : navIcon}
          style={styles.leftIOS}
          onPress={handleIconClicked}
        />
        <Text
          style={[styles.titleIOS,
          showActionButton ? { paddingLeft: 0 } : { paddingLeft: -35 }]}
        >
          {title}
        </Text>
        {showActionButton && action.show === 'always' ?
          <ImageButton
            containerStyle={showActionButton ? styles.rightIOS : { height: 0, width: 0 }}
            source={action.icon}
            onPress={onActionSelected}
          /> :
          <Button
            containerStyle={showActionButton ? styles.rightIOS : { height: 0, width: 0 }}
            style={styles.rightText}
            text={showActionButton ? action.title : ''}
            onPress={onActionSelected}
          />
        }
      </View>
    );
  };

  const Toolbar = Platform.select({
    android: () => renderToolbarAndroid(),
    ios: () => renderToolbarIOS()
  });

  return <Toolbar />;
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    backgroundColor: '#3e9ce9',
    alignItems: 'center',
    height: 58
  },
  titleIOS: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 20
  },
  leftIOS: {
    height: 25,
    width: 25,
    marginTop: 20,
    marginLeft: 10
  },
  rightIOS: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginRight: 10,
  },
  rightText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18
  }
});

ReadingToolbar.propTypes = propTypes;

ReadingToolbar.defaultProps = {
  onActionSelected() {},
  title: '',
  actions: []
};

export default ReadingToolbar;

// <TouchableOpacity
// 	key={'leftIcon'}
// 	activeOpacity={0.75}
// 	onPress={this.props.leftIconAction}>
// 		<Icon color="white" size={30} name={'repeat'}/>
// </TouchableOpacity>
