import { createBrowserHistory } from "client/src/apis/history/history";

let history;
if (typeof document !== "undefined") {
  history = createBrowserHistory();
}
export default history;

