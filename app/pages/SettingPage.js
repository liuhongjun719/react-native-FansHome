import React, {
    Component
} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    WebView,
    ListView,
    TouchableOpacity,
    Switch,
    InteractionManager,
    Dimensions,
    Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


import ReadingToolbar from '../components/ReadingToolbar';
import { naviGoBack } from '../utils/CommonUtil';

const maxHeight = Dimensions.get('window').height;
const maxWidth = Dimensions.get('window').width;

export default class SettingPage extends Component {
  constructor(props) {
      super(props);
      this._onValueChange = this._onValueChange.bind(this);
      this._renderRow = this._renderRow.bind(this);
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
          dataSource: ds.cloneWithRows(['意见反馈', '评分', '版本号', '整点通知']),
          isSwitchOn: false,
      };
  }

  _onValueChange(value) {
    console.log('value-------:' + value);
    this.setState({
      isSwitchOn: value,
    })
    console.log('vvvvvvv' + this.state.isSwitchOn);
  }
  //评价
  onPress(url) {
  Linking.openURL(url);
  }

  _renderRow(
    rowData: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    // console.log('this.state.isSwitchOn:----------' + this.state.isSwitchOn);
    console.log('kkkkkkkkkkkkkkk---------------');
    if (rowID == 0) {
      return(
        <TouchableOpacity
        activeOpacity={0.75}>
          <View style = {styles.container}>
              <Text>{rowData}</Text>
              <Icon color="gray" size={20} name='angle-right'/>
          </View>
        </TouchableOpacity>
      );
    }else if (rowID == 1) {
      return(
        <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => this.onPress('https://appsto.re/cn/TpWo4.i')}
        >
          <View style = {styles.container}>
              <Text>{rowData}</Text>
              <Icon color="gray" size={20} name='angle-right'/>
          </View>
        </TouchableOpacity>
      );
    }else if (rowID == 2) {
      return(
        <TouchableOpacity
        activeOpacity={1}>
          <View style = {styles.container}>
              <Text>{rowData}</Text>
              <Text>{'v.1.2.5'}</Text>
          </View>
        </TouchableOpacity>
      );
    }else if (rowID == 3) {///
      return(
        <TouchableOpacity
        activeOpacity={1}>
          <View style = {styles.container}>
              <Text>{rowData}</Text>
              <Switch
               value = {this.state.isSwitchOn}
               onValueChange = {this._onValueChange}
               />
          </View>
        </TouchableOpacity>
      );
    }

  }


    render() {
      console.log('render------------------');
      const { navigator, route } = this.props;
        return (
            <View style = {{backgroundColor: 'white', height: maxHeight, width: maxWidth}}>
            <ReadingToolbar
              title={'设置'}
              navigator={navigator}
            />
                <ListView
                  style = {styles.list}
                  dataSource = {this.state.dataSource}
                  renderRow = {this._renderRow}
                  />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    list: {
        width: maxWidth,
        height: maxHeight-64,
        paddingLeft: 10,
        paddingRight: 0,
    },
    container: {
        height: 50,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomColor: 'rgb(245, 244, 245)',
        borderBottomWidth: 0.5,

    },
})
