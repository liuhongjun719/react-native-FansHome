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
  TextInput
} from 'react-native';


import Util from '../utils/utils';
import moment from 'moment';
require('moment/locale/zh-cn');


const maxHeight = Dimensions.get('window').height;
const maxWidth = Dimensions.get('window').width;

var resultsCache = {
	messageData:{},//评价列表数据
};

class MessagePage extends React.Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.getCommendData = this.getCommendData.bind(this);
    this.pressLikeHeart = this.pressLikeHeart.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
     }),
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


  getCommendData(){
    var message_url = 'http://api.auto.app887.com/api/Talks.action?opc=10&npc=0&id=';
    message_url += this.props.article.ID;
    console.log('message_url=========:' + message_url);
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


  dismissMessageModal() {
    InteractionManager.runAfterInteractions(() => {
      DeviceEventEmitter.emit('CloseMessagePage');
    });
  }
  //点击cell右侧的喜欢图标，点击完没有变化的原因是，该接口是post请求的， 所以抓取接口后就.......你懂的
  pressLikeHeart(rowData) {
    let uid = rowData.USERS;
    let id = rowData.ID;
    console.log('uid------------------:' + uid );
    var like_url = 'http://api.auto.app887.com/api/LikeArt.action?uid=';
    like_url += uid;
    like_url += '&id=';
    like_url += id;
    console.log('like_url=========:' + like_url);
    Util.get(like_url,(response) => {
      console.log('成功------');
      this.getCommendData();
    },(error) => {
      console.log('失败------');
    });
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
    // const { navigator, route } = this.props;
    return (
      <View>
        <View style = {styles.modal_top}>
          <Text style = {styles.modal_title}>{this.props.article.title}</Text>
          <TouchableOpacity
            activeOpacity={0.75}
            style = {styles.modal_close}
            onPress = {this.dismissMessageModal.bind(this)}>
            <View>
              <Text style = {{marginTop: 10}}>关闭</Text>
            </View>
          </TouchableOpacity>
        </View>
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
          <TextInput style={styles.comment_input} placeholder = '  添加评论'/>
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


// <View style = {{height: 40, width: maxWidth, backgroundColor: 'rgb(226, 226, 226)', padding: 5}}>
// <TouchableOpacity
//   activeOpacity={1}
//   style = {styles.comment_btn}
//   >
//     <Text style = {{marginTop: 8, marginLeft: 5, color: 'rgb(226, 226, 226)', fontSize: 12}}>添加评论</Text>
// </TouchableOpacity>
// </View>


// <KeyboardTrackingView style = {{height: 40, width: maxWidth, backgroundColor: 'rgb(226, 226, 226)', padding: 5}}>
//   <TextInput style={styles.comment_btn} placeholder = '添加评论'/>
// </KeyboardTrackingView>
