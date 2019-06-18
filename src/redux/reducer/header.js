import ReduxTypes from "../config/ReduxTypes";


const delay = (ms) => new Promise(resolve =>
  setTimeout(resolve, ms)
);

// 액션 생성자
export function setDropdownShow(dropdownShow: boolean, callback) {
  return (dispatch) => {
    dispatch({ type: ReduxTypes.SET_DROPDOWN_SHOW, dropdownShow });
    return delay(100).then(() => {
      //callback();
    })
  };
}


// 초기 상태
const initState = {
  dropdownShow: false,
};

// 리듀서
export default (state = initState, action: any) => {
  switch (action.type) {
    case ReduxTypes.SET_DROPDOWN_SHOW:
      return {
        ...state,
        dropdownShow: action.dropdownShow
      };
    default:
      return state;
  }
}