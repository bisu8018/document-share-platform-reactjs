import ReduxTypes from "../config/ReduxTypes";

// 액션 생성자
export const setAway = (away: boolean) => ({ type: ReduxTypes.SET_AWAY, away });

// 초기 상태
const initState = {
  away: false,
};


// 리듀서
export default (state = initState, action: any) => {
  switch (action.type) {
    case ReduxTypes.SET_AWAY:
      return {
        ...state,
        away: action.away
      };
    default:
      return state;
  }
}
