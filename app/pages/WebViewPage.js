/**
 *
 * Copyright 2016-present reading
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import React from 'react';
import {
  StyleSheet,
  WebView,
  BackAndroid,
  Text,
  Image,
  TouchableWithoutFeedback,
  View,
  Modal,
  Dimensions,
  TouchableOpacity,
  Navigator,
  DeviceEventEmitter,
} from 'react-native';

import ReadingToolbar from '../components/ReadingToolbar';
import LoadingView from '../components/LoadingView';
import { naviGoBack } from '../utils/CommonUtil';
import MessagePage from '../pages/MessagePage';
import { formatTitleString } from '../utils/FormatUtil';


let canGoBack = false;
const maxHeight = Dimensions.get('window').height;
const maxWidth = Dimensions.get('window').width;

class WebViewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
      transparentState: true,
    };
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
    this.goBack = this.goBack.bind(this);
    this.dismissMessageModal = this.dismissMessageModal.bind(this);
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.goBack);
    DeviceEventEmitter.addListener('CloseMessagePage', () => {
      this.dismissMessageModal();
    });
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.goBack);
    DeviceEventEmitter.removeAllListeners('CloseMessagePage');

  }


  onNavigationStateChange(navState) {
    canGoBack = navState.canGoBack;
  }

  goBack() {
    if (canGoBack) {
      this.webview.goBack();
      return true;
    }
    return naviGoBack(this.props.navigator);
  }

  renderLoading() {
    return <LoadingView />;
  }


  //显示评论界面
  showMessageModal() {
    this.setState({
      isShowModal: true,
      transparentState: false,
    })
  }

  dismissMessageModal() {
    this.setState({
      isShowModal: false,
      transparentState: true,
    })
  }
  //创建 Modal 界面上的内容
  renderModalContent() {
    const { navigator, route } = this.props;
    return(
      <MessagePage article = {route.article}/>
    );
  }




  render() {
    const { navigator, route } = this.props;
    return (
      <View style={styles.container}>
        <ReadingToolbar
          title={formatTitleString(route.article.title)}
          navigator={navigator}
        />
        <Modal
          animationType="slide"
          visible={this.state.isShowModal}
          transparent = {this.state.transparentState}
          onRequestClose={() => {
            this.setState({
              isShareModal: false
            });
          }}
          >
          {this.renderModalContent()}
        </Modal>
        <WebView
          ref={(ref) => { this.webview = ref; }}
          automaticallyAdjustContentInsets={false}
          style={{ flex: 1 }}
          source={{ uri: route.article.url }}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          scalesPageToFit
          decelerationRate="normal"
          onShouldStartLoadWithRequest={() => {
            const shouldStartLoad = true;
            return shouldStartLoad;
          }}
          onNavigationStateChange={this.onNavigationStateChange}
          renderLoading={this.renderLoading}
        />
        <View style = {styles.bottom_tool}>
          <TouchableOpacity
            activeOpacity={0.75}>
            <View style= {{flexDirection: 'row'}}>
              <Image source = {{uri: 'write.png', height: 20, width: 20}}></Image>
              <Text style = {{marginTop: 5, marginLeft: 10, color: 'rgb(106, 106, 106)'}}>写评论</Text>
              <View style = {{height: 25, width: 1, backgroundColor: 'rgb(106, 106, 106)', marginLeft: 10}}></View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress = {this.showMessageModal.bind(this)}
            >
            <View style= {{flexDirection: 'row'}}>
              <Image source = {{uri: 'message.png', height: 25, width: 25}}></Image>
              <Text style = {{marginTop: 5, marginLeft: 10, color: 'rgb(106, 106, 106)', color: 'red'}}>{(route.article.talkcount != 0) ? route.article.talkcount : ''}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}>
            <View>
            <Image source = {{uri: 'share.png', height: 25, width: 25}}></Image>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}>
            <View>
            <Image source = {{uri: 'recommend.png', height: 25, width: 25}}></Image>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },

  bottom_tool: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: 'rgb(254, 253, 254)',
    width: maxWidth,
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 60,
    borderTopColor: 'rgb(106, 106, 106)',
    borderTopWidth: 0.5,
    paddingBottom: 15,
  },
  modal_top: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: 'rgb(244, 244, 244)',
    paddingLeft: 10,
    paddingRight: 10,
  },
  modal_title: {
    flex: 1,
    alignSelf: 'center',
    marginTop: 10,
  },
  modal_close: {
    height: 40,
    alignSelf: 'center',
    marginTop: 10
  },
});

export default WebViewPage;
