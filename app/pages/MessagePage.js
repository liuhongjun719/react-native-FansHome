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
  DeviceEventEmitter,
  InteractionManager,
  ListView,
  RefreshControl,
  TextInput,
} from 'react-native';


import Util from '../utils/utils';
import moment from 'moment';
require('moment/locale/zh-cn');


const maxHeight = Dimensions.get('window').height;
const maxWidth = Dimensions.get('window').width;

var resultsCache = {
	messageData: {},//评价列表数据
  publish_comment_text: '',//评论的内容
  user_ID: '',//评论接口中的ID
};

class MessagePage extends React.Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.getCommendData = this.getCommendData.bind(this);
    this.pressLikeHeart = this.pressLikeHeart.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.textInputOnFocus = this.textInputOnFocus.bind(this);
    this.renderModalContent = this.renderModalContent.bind(this);
    this.dismissCommentModal = this.dismissCommentModal.bind(this);
    this.publishComment = this.publishComment.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
     }),
     isShowModal: false,
     transparentState: true,
    };

    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {
    this.getCommendData();
  }

  getDataSource(datas: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(datas);
  }

  //获取评论列表数据
  getCommendData(){
    var message_url = 'http://api.auto.app887.com/api/Talks.action?opc=10&npc=0&id=';
    message_url += this.props.article.ID;
    // console.log('message_url=========:' + message_url);
    Util.get(message_url,(response) => {
      console.log('成功------');
      resultsCache.messageData = response.root.list;
      this.setState({
        dataSource: this.getDataSource(response.root.list),
      });

    },(error) => {
      console.log('失败------');
    });
  }

  componentWillUnmount() {
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


  closeMessageModal() {
    InteractionManager.runAfterInteractions(() => {
      DeviceEventEmitter.emit('CloseMessagePage');
    });
  }

  //发表评论
  publishComment() {
    if (resultsCache.publish_comment_text.length == 0) {//评论内容为空
      return;
    }
    let publish_comment_url = 'http://api.auto.app887.com/api/Talk.action?uid=903810&id=';
    publish_comment_url += resultsCache.user_ID;
    publish_comment_url += '&text=';
    publish_comment_url += resultsCache.publish_comment_text;
    // console.log('发表评论URL-----------:' + publish_comment_url);
    Util.get(publish_comment_url,(response) => {
      this.dismissCommentModal();
      this.getCommendData();
    },(error) => {
        console.log('分类数据error==>' + error);
    });

  }

  onChangeText(changeText) {
    resultsCache.publish_comment_text = changeText;
  }





  //点击cell右侧的喜欢图标，点击完没有变化的原因是，该接口是post请求的， 所以抓取接口后就.......你懂的
  pressLikeHeart(rowData) {
    let uid = rowData.USERS;
    let id = rowData.ID;
    var like_url = 'http://api.auto.app887.com/api/LikeArt.action?uid=';
    like_url += uid;
    like_url += '&id=';
    like_url += id;
    // console.log('like_url=========:' + like_url);
    Util.get(like_url,(response) => {
      console.log('成功------');
      this.getCommendData();
    },(error) => {
      console.log('失败------');
    });
    }

    //创建 添加评论 界面
    renderModalContent() {
      return(
        <View style = {{height: maxHeight, widht: maxWidth, backgroundColor: 'rgba(255, 255, 255, 0.65)', flexDirection: 'column'}}>
          <TouchableOpacity
            activeOpacity={1}
            style = {{backgroundColor: 'rgba(255, 255, 255, 0.65)', height: maxHeight-150-220, width: maxWidth}}
            onPress = {this.dismissCommentModal}>
          </TouchableOpacity>
          <View style = {{ flexDirection: 'column', backgroundColor: 'rgb(226, 226, 226)', height: 150, widht: maxWidth}}>
            <View style = {{paddingTop: 10, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', justifyContent: 'space-between', height: 40, widht: maxWidth}}>
              <TouchableOpacity
                activeOpacity={0.75}
                style = {{}}
                onPress = {this.dismissCommentModal}>
                <View>
                <Text style = {{}}>关闭</Text>
                </View>
              </TouchableOpacity>

              <Text style = {{fontSize: 18, textAlign: 'right'}}>写评论</Text>

              <TouchableOpacity
                activeOpacity={0.75}
                style = {{}}
                onPress = {this.publishComment}>
                <View>
                <Text style = {{}}>发送</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TextInput onEndEditing= {this.dismissCommentModal} onChangeText = {this.onChangeText} style = {{height: 60, marginLeft: 10, marginRight: 10, marginBottom: 10, borderRadius: 4, backgroundColor: 'white', widht: maxWidth}} autoFocus = {true}/>
          </View>

        </View>
      );
    }
    //点击textinput时获得焦点，弹出Modal
    textInputOnFocus() {
      this.setState({
        isShowModal: true,
        transparentState: false,
      })
    }

      dismissCommentModal() {
        this.setState({
          isShowModal: false,
          transparentState: true,
        })
      }

  renderRow(rowData) {
      return (

          <TouchableOpacity
              activeOpacity={0.75}
              style={styles.center}
              >
              <View style = {styles.message_cell_back}>
                 <Image style = {styles.message_left_image} source = {{uri: 'Icon_'+rowData.TYPEID+'.png'}}></Image>
                 <View style = {styles.message_right_view}>
                    <View style = {styles.message_right_top_view}>
                      <View style = {styles.message_name_view}>
                        <Text>无花果</Text>
                        <Text style = {styles.message_ctime}>{moment(rowData.CTIME).fromNow()}</Text>
                      </View>
                      <TouchableOpacity
                          activeOpacity={0.75}
                          onPress = {this.pressLikeHeart.bind(this, rowData)}
                          >
                          <View style = {styles.message_like_button}>
                             <Image style = {styles.message_image_like} source = {{uri: (rowData.melikecount == 0) ? 'heart_gray.png' : 'heart_red.png',  height: 20, width: 20}}></Image>
                             <Text style = {styles.message_text} numberOfLines = {2}>{(rowData.likecount == 0) ? '' : rowData.likecount}</Text>
                          </View>
                      </TouchableOpacity>
                    </View>
                    <Text style = {styles.message_text}>{rowData.TEXTS}</Text>
                 </View>
              </View>
          </TouchableOpacity>
      );
  }

  onRefresh(typeId) {
    this.getCommendData();
  }

  render() {
    //保存ID，用来发表评论接口时使用
    resultsCache.user_ID = this.props.article.ID;
    return (
      <View>
        <View style = {styles.modal_top}>
          <Text style = {styles.modal_title}>{this.props.article.title}</Text>
          <TouchableOpacity
            activeOpacity={0.75}
            style = {styles.modal_close}
            onPress = {this.closeMessageModal.bind(this)}>
            <View>
              <Text style = {{marginTop: 10}}>关闭</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          visible={this.state.isShowModal}
          transparent = {true}

          >
          {this.renderModalContent()}
        </Modal>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          enableEmptySections={true}
          initialListSize= {10}
          style={{ height: maxHeight-60-40}}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => this.onRefresh()}
              title="Loading..."
              colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
            />
          }
        />
        <View style = {{height: 40, width: maxWidth, backgroundColor: 'rgb(226, 226, 226)', padding: 5}}>
          <TextInput style={styles.comment_input} placeholder = '  添加评论'
          onFocus = {this.textInputOnFocus}/>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
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

  //
  center:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
},



title: {
  textAlign: 'left',
  marginLeft: 30,
  alignSelf: 'center',
  marginLeft: 30,
},

message_cell_back: {
  width: maxWidth-25,

  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'white',
  borderBottomColor: '#ccc',
  borderBottomWidth: 1,
  paddingLeft: 10,
  paddingTop: 10,
  paddingBottom: 10,
},

message_left_image: {
  height: 40,
  width: 40,
  borderRadius: 20,
  marginRight: 10,
},
message_right_view: {
  flex: 1,
  flexDirection: 'column',
},
message_right_top_view: {
  flexDirection: 'row',
},
message_name_view: {
  flexDirection: 'column',
  flex: 1,
},
message_image_like: {
  height: 20,
  width: 25,
  marginLeft: 10,
},
message_text: {
  flex: 1,
  marginLeft: 5,
},
message_like_count: {
  textAlign: 'left',
  marginLeft: 30,
  justifyContent: 'space-between',
},
message_like_button: {
  flexDirection: 'row',
  height: 30,
  width: 50,
},
message_ctime: {
  color: 'rgb(142, 142, 142)',
  fontSize: 12,
  marginTop: 10,
  marginBottom: 10,
},
 comment_input:{
   backgroundColor: 'white',
   borderRadius: 4,
   borderColor: '#f0f8ff',
   borderWidth: 0.5,
   height: 30,
   fontSize: 12,
   marginLeft: 5,
 }


});

export default MessagePage;
