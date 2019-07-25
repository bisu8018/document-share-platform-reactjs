import { combineReducers } from "redux";
import main from './main'
import audienceTracking from './audienceTracking'
import emailModal from "./emailModal";
import header from "./header";

export default combineReducers({
  main,
  audienceTracking,
  emailModal,
  header
})
