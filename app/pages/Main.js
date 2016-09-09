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
import React, { PropTypes } from 'react';
import {
  StyleSheet,
  ListView,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  InteractionManager,
  ActivityIndicator,
  Image,
  Dimensions,
  Platform,
  View,
  DeviceEventEmitter,
} from 'react-native';

// import DrawerLayout from 'react-native-drawer-layout';
// import TimeAgo from 'react-native-timeago';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import * as readAction from '../actions/read';
import * as fetchBannersAction from '../actions/read';

import LoadingView from '../components/LoadingView';
import ReadingToolbar from '../components/ReadingToolbar';
import { toastShort } from '../utils/ToastUtil';
import Storage from '../utils/Storage';
import { CATEGORIES } from '../constants/Alias';
import WebViewPage from '../pages/WebViewPage';
import { formatTitleString } from '../utils/FormatUtil';
import Swiper from 'react-native-swiper';
import SettingPage from '../pages/SettingPage';
import PricePage from '../pages/PricePage';


require('moment/locale/zh-cn');

const refreshImg = require('../img/refresh.png');
const shareImg = require('../img/setting.png');

let toolbarActions = [
  { title: '设置', icon: shareImg, show: 'always' }
];

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  read: PropTypes.object.isRequired
};

const maxHeight = Dimensions.get('window').height;
const maxWidth = Dimensions.get('window').width;

let canLoadMore;
let page = 0;
let loadMoreTime = 0;


var changeTab = {
  savedTypeId: 0,
  onChangeTabSavedIndex: 0,
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      typeIds: [],
    };
    this.renderItem = this.renderItem.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onIconClicked = this.onIconClicked.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    this.onActionSelected = this.onActionSelected.bind(this);
    canLoadMore = false;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    InteractionManager.runAfterInteractions(() => {
      Storage.get('typeIds')
        .then((typeIds) => {
          if (!typeIds) {
            typeIds = [0, 12, 9];
          }
          typeIds.forEach((typeId) => {
            dispatch(readAction.fetchArticles(false, true, typeId));
            if (typeId == 0) {
              dispatch(fetchBannersAction.fetchBanners());
            }
          });
          this.setState({
            typeIds
          });
        });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { read } = this.props;
    if (read.isLoadMore && !nextProps.read.isLoadMore && !nextProps.read.isRefreshing) {
      if (nextProps.read.noMore) {
        toastShort('没有更多数据了');
      }
    }
  }

  componentWillUnmount() {
  }

  onRefresh(typeId) {
    const { dispatch } = this.props;
    canLoadMore = false;
    dispatch(readAction.fetchArticles(true, false, typeId));
    if (typeId == 0) {
      dispatch(fetchBannersAction.fetchBanners());
    }
  }

  onPress(article) {
    const { navigator } = this.props;
    navigator.push({
      component: WebViewPage,
      name: 'WebViewPage',
      article
    });
  }

  // TODO: 保存tab的点击位置
  onChangeTab(tab) {
    changeTab.onChangeTabSavedIndex = tab.i;
    if (tab.i == 0) {
      changeTab.savedTypeId = 0;
    }else if (tab.i == 1) {
      changeTab.savedTypeId = 12;
    }else if (tab.i == 2) {
      changeTab.savedTypeId = 9;
    }else if (tab.i == 3) {
      changeTab.savedTypeId = 2;
    }
  }

  onActionSelected() {
    const { navigator } = this.props;
    navigator.push({
      component: SettingPage,
      name: 'SettingPage',
    });

  }



  // TODO: 导航左上角的 刷新 按钮
  onIconClicked() {
    const { dispatch } = this.props;
    canLoadMore = false;
    //针对 报价 界面
    if (changeTab.savedTypeId == 2) {
      InteractionManager.runAfterInteractions(() => {
        DeviceEventEmitter.emit('RefreshPricePage');
      });
    }else {//针对 新闻 导购 行情 界面
      dispatch(readAction.fetchArticles(true, false, changeTab.savedTypeId));
      if (changeTab.savedTypeId == 0) {//只有 新闻 界面加载banner
        dispatch(fetchBannersAction.fetchBanners());
      }
    }
  }

  onScroll() {
    if (!canLoadMore) {
      canLoadMore = true;
    }
  }

  onEndReached(typeId) {
    const time = Date.parse(new Date()) / 1000;
    if (canLoadMore && time - loadMoreTime > 1) {
      page++;
      const { dispatch } = this.props;
      dispatch(readAction.fetchArticles(false, false, typeId, true, page));
      canLoadMore = false;
      loadMoreTime = Date.parse(new Date()) / 1000;
    }
  }

  renderFooter() {
    const { read } = this.props;
    if (read.isLoadMore) {
      return (
        <View
          style={{ flex: 1, flexDirection: 'row', justifyContent: 'center',
            alignItems: 'center', padding: 5 }}
        >
          <ActivityIndicator size="small" color="#3e9ce9" />
          <Text style={{ textAlign: 'center', fontSize: 16, marginLeft: 10 }}>
            数据加载中……
          </Text>
        </View>
      );
    }
    return null;
  }

  renderItem(article) {
    return (
      <TouchableOpacity onPress={() => this.onPress(article)}>
        <View style={styles.containerItem}>
          <Image
            style={{ width: 88, height: 66, marginRight: 10 }}
            source={{ uri: article.imglink }}
          />
          <View style={{ flex: 1, flexDirection: 'column' }} >
            <Text style={styles.title}>
              {formatTitleString(article.title)}
            </Text>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
              <Text
                style={{ flex: 1, fontSize: 14, color: 'rgb(142, 142, 142)',
                  marginTop: 5, marginRight: 5 }}
              >
                {article.sourcename}
              </Text>

            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

    renderHeader(){
      const { read } = this.props;
      const bannerList = read.bannerList;
      return (
        <Swiper
          height={200}
          loop={true}
          autoplay={true}
          dot={<View style={styles.customDot} />}
          activeDot={<View style={styles.customActiveDot} />}
          paginationStyle={{
              bottom: 10
          }}>
          {
            bannerList.map((banner, i) => {
              return (
                  <TouchableOpacity key={i} activeOpacity={0.75}
                  onPress={() => this.onPress(banner)}>
                      <Image
                          style={styles.bannerImage}
                          source={{uri: banner.imglink}}
                          />
                  </TouchableOpacity>
              )
            })
          }
        </Swiper>
      );
   }

  renderContent(dataSource, typeId) {
    const { read } = this.props;
    if (read.loading) {
      return <LoadingView />;
    }
    const isEmpty = read.articleList[typeId] === undefined || read.articleList[typeId].length === 0;
    if (isEmpty) {
      return (
        <ScrollView
          automaticallyAdjustContentInsets={false}
          horizontal={false}
          contentContainerStyle={styles.no_data}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={read.isRefreshing}
              onRefresh={() => this.onRefresh(typeId)}
              title="Loading..."
              colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
            />
          }
        >
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16 }}>
              目前没有数据，请刷新重试……
            </Text>
          </View>
        </ScrollView>
      );
    }
    return (
      <ListView
        initialListSize={1}
        dataSource={dataSource}
        renderRow={this.renderItem}
        renderHeader={(typeId == 0) ? this.renderHeader : null}
        style={styles.listView}
        onEndReached={() => this.onEndReached(typeId)}
        onEndReachedThreshold={10}
        onScroll={this.onScroll}
        renderFooter={this.renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={read.isRefreshing}
            onRefresh={() => this.onRefresh(typeId)}
            title="Loading..."
            colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
          />
        }
      />
    );
  }



  render() {
    const { read, navigator } = this.props;
    return (
        <View style={styles.container}>
          <ReadingToolbar
            actions={toolbarActions}
            onActionSelected={this.onActionSelected}//导航右上角按钮
            onIconClicked={this.onIconClicked}//导航左上角按钮
            navIcon={refreshImg}
            title="车迷之家"
            navigator={navigator}
          />
          <ScrollableTabView
            renderTabBar={() =>
              <DefaultTabBar
                underlineHeight={2}
                tabStyle={{ paddingBottom: 0 }}
                textStyle={{ fontSize: 16 }}
              />
            }
            tabBarBackgroundColor="#fcfcfc"
            tabBarUnderlineColor="#3e9ce9"
            tabBarActiveTextColor="#3e9ce9"
            tabBarInactiveTextColor="#aaaaaa"
            locked = {true}
            page = {changeTab.onChangeTabSavedIndex}
            onChangeTab= {this.onChangeTab}
          >
          {this.state.typeIds.map((typeId) => {
            const typeView = (
              <View
                key={typeId}
                tabLabel={CATEGORIES[typeId]}
                style={{ flex: 1}}
              >
                {this.renderContent(this.state.dataSource.cloneWithRows(
                  read.articleList[typeId] === undefined ? [] : read.articleList[typeId]), typeId)}
              </View>);
            return typeView;
          })}
          <PricePage tabLabel = '报价'/>
          </ScrollableTabView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  containerItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcfcfc',
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1
  },
  title: {
    fontSize: 18,
    textAlign: 'left',
    color: 'black'
  },
  listView: {
    backgroundColor: '#eeeeec'
  },
  no_data: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100
  },


  // TODO: banner setting
  customDot: {
    backgroundColor: '#ccc',
    height: 6,
    width: 6,
    marginLeft: 2,
    marginRight: 2,
    marginTop: 4,
    borderRadius: 3,
  },
  customActiveDot: {
    backgroundColor: 'white',
    height: 6,
    width: 6,
    marginLeft: 2,
    marginRight: 2,
    marginTop: 4,
    borderRadius: 3,
},
bannerImage: {
    height: 200,
    width: maxWidth,
},
});

Main.propTypes = propTypes;

export default Main;
