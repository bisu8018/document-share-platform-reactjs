export default class DocumentList {
  count: number;
  pageNo: number;
  resultList: any;
  totalViewCountInfo: number;

  constructor(data) {
    this.count = data.count ? data.count : 0;
    this.pageNo = data.pageNo ? data.pageNo : 1;
    this.resultList = data.resultList ? data.resultList : {};
    this.totalViewCountInfo = data.totalViewCountInfo ? data.totalViewCountInfo : 0;
  }

}