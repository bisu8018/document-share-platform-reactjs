import ReduxTypes from "../config/ReduxTypes";


const delay = (ms) => new Promise(resolve =>
  setTimeout(resolve, ms)
);

// 액션 생성자
export const setAction = {
  tempEmail : (tempEmail: boolean, callback) => {
  return (dispatch) => {
    dispatch({ type: ReduxTypes.SET_TEMP_EMAIL, tempEmail });
    return delay(100).then(() => {
      //callback();
    })
  }},
};


// 초기 상태
const initState = {
  tempEmail: null,
};

// 리듀서
export default (state = initState, action: any) => {
  switch (action.type) {
    case ReduxTypes.SET_TEMP_EMAIL:
      return {
        ...state,
        tempEmail: action.tempEmail
      };
    default:
      return state;
  }
}
