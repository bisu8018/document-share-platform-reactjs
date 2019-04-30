export default class DocumentList {
  resultList: any;
  voteDocList: any;
  totalViewCountInfo: number;

  constructor(data) {
    this.resultList = data.resultList ? data.resultList : {};
    this.voteDocList = data.voteDocList ? data.voteDocList : {};
    this.totalViewCountInfo = data.totalViewCountInfo ? data.totalViewCountInfo : 0;
  }

}