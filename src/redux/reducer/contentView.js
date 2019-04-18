import ReduxTypes from "../config/ReduxTypes"

// 액션 생성자
export const setIsDocumentExist = (isDocumentExist:boolean) => ({ type: ReduxTypes.SET_IS_DOCUMENT_EXIST, isDocumentExist });

// 초기 상태
const initState = {
  isDocumentExist: false,
};

// 리듀서
export default (state = initState, action: any) => {
  switch(action.type) {
    case ReduxTypes.SET_IS_DOCUMENT_EXIST:
      return {
        ...state,
        isDocumentExist: action.isDocumentExist
      };
    default:
      return state
  }
}