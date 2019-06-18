import { combineReducers } from "redux";
import main from './main'
import contentView from './contentView'
import audienceTracking from './audienceTracking'
import emailModal from "./emailModal";
import header from "./header";

export default combineReducers({
  main,
  contentView,
  audienceTracking,
  emailModal,
  header
})