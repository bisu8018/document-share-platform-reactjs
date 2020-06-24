import ReduxTypes from "../config/ReduxTypes";


const delay = (ms) => new Promise(resolve =>
  setTimeout(resolve, ms)
);


// 액션 생성자
export const setAction = {
  showAnonymous : (showAnonymous: boolean, dispatch, callback) => {
    dispatch({ type: ReduxTypes.SET_SHOW_ANONYMOUS, showAnonymous });
    return delay(100).then(() => callback());
  },
  includeOnlyOnePage : (includeOnlyOnePage: boolean, dispatch, callback) => {
    dispatch({ type: ReduxTypes.SET_INCLUDE_PAGE_ONLY_ONE, includeOnlyOnePage });
    return delay(100).then(() => callback());
  },
};


// 초기 상태
const initState = {
  showAnonymous: false,
  includeOnlyOnePage: false
};

// 리듀서
export default (state = initState, action: any) => {
  switch (action.type) {
    case ReduxTypes.SET_SHOW_ANONYMOUS:
      return {
        ...state,
        showAnonymous: action.showAnonymous
      };
    case ReduxTypes.SET_INCLUDE_PAGE_ONLY_ONE:
      return {
        ...state,
        includeOnlyOnePage: action.includeOnlyOnePage
      };
    default:
      return state;
  }
}
