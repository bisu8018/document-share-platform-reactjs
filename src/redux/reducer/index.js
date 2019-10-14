import { combineReducers } from "redux";
import main from './main'
import audienceTracking from './audienceTracking'
import emailModal from "./emailModal";
import header from "./header";
import contentView from "./contentView";

export default combineReducers({
  main,
  audienceTracking,
  emailModal,
  header,
  contentView
})
