export default class DocumentList {
  count;
  pageNo;
  resultList;
  totalViewCountInfo;

  constructor(data) {
    this.count = data.count ? data.count : 0;
    this.pageNo = data.pageNo ? data.pageNo : 1;
    this.resultList = data.resultList ? data.resultList : {};
    this.totalViewCountInfo = data.totalViewCountInfo ? data.totalViewCountInfo : null;
  }

}