import { combineReducers } from "redux";
import main from './main'
import contentView from './contentView'
import audienceTracking from './audienceTracking'

export default combineReducers({
  main,
  contentView,
  audienceTracking
})