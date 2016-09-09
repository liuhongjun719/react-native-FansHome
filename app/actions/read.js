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
import * as types from '../constants/ActionTypes';
import Util from '../utils/utils';


// TODO: List
export let fetchArticles = (isRefreshing, loading, typeId, isLoadMore, page = 0) => {
  let type = '';
  if (typeId == '0') {
    type = '%E6%96%B0%E9%97%BB'
  }else if (typeId == '12') {
    type = '%E5%AF%BC%E8%B4%AD'
  }else if (typeId == '9') {
    type = '%E8%A1%8C%E6%83%85'
  }else if (typeId == '2') {
  }
    let URL = 'http://api.auto.app887.com/api/Articles.action?opc=10&npc=';
    URL += page;
    URL += '&type=';
    URL += type;
    console.log('URL=======:' + URL);
    return dispatch => {
        dispatch(fetchArticleList(isRefreshing, loading, isLoadMore));
        return Util.get(URL,(response) => {
            console.log('articleList--------result------:'+ response.root.list.length);
            dispatch(receiveArticleList(response.root.list, typeId));
        },(error) => {
            console.log('分类数据error==>' + error);
            dispatch(receiveArticleList([]));
        });
    }
}

function fetchArticleList(isRefreshing, loading, isLoadMore = false) {
  return {
    type: types.FETCH_ARTICLE_LIST,
    isRefreshing,
    loading,
    isLoadMore
  };
}

function receiveArticleList(articleList, typeId) {
  return {
    type: types.RECEIVE_ARTICLE_LIST,
    articleList,
    typeId
  };
}



// TODO: Banner
export let fetchBanners = () => {
    let URL = 'http://api.auto.app887.com/api/Articles.action?opc=10&npc=0&type=%E5%A4%A7%E5%9B%BE%E6%8E%A8%E8%8D%90';
    console.log('URL=======:' + URL);
    return dispatch => {
        dispatch(fetchBannersList());
        return Util.get(URL,(response) => {
            dispatch(receiveBannersList(response.root.list));
        },(error) => {
            console.log('分类数据error==>' + error);
            dispatch(receiveBannersList([]));
        });
    }
}

function fetchBannersList() {
  return {
      type: types.FETCH_BANNER_LIST,
  }
}

function receiveBannersList(bannerList) {
  return {
      type: types.RECEIVE_BANNER_LIST,
      bannerList: bannerList,
  }
}
