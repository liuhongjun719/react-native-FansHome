
import * as types from '../constants/ActionTypes';

const initialState = {
  isRefreshing: false,
  loading: false,
  isLoadMore: false,
  noMore: false,
  articleList: {},
  bannerList: [],

};

export default function read(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_ARTICLE_LIST:
      return Object.assign({}, state, {
        isRefreshing: action.isRefreshing,
        loading: action.loading,
        isLoadMore: action.isLoadMore
      });
    case types.RECEIVE_ARTICLE_LIST:
      return Object.assign({}, state, {
        isRefreshing: false,
        isLoadMore: false,
        noMore: action.articleList.length === 0,
        articleList: state.isLoadMore ? loadMore(state, action) : refresh(state, action),
        loading: state.articleList[action.typeId] === undefined
      });
      case types.FETCH_BANNER_LIST:
          return {
              ...state,
          }
      case types.RECEIVE_BANNER_LIST:
          return Object.assign({}, state, {
              bannerList: action.bannerList,
          })
    default:
      return state;
  }
}

function refresh(state, action) {
  state.articleList[action.typeId] = action.articleList;
  return state.articleList;
}

function loadMore(state, action) {
  state.articleList[action.typeId] = state.articleList[action.typeId].concat(action.articleList);
  return state.articleList;
}
