export default class DocumentList {
  resultList: any;
  totalViewCountInfo: number;

  constructor(data) {
    this.resultList = data.resultList ? data.resultList : {};
    this.totalViewCountInfo = data.totalViewCountInfo ? data.totalViewCountInfo : 0;
  }

}