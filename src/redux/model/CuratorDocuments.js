export default class CuratorDocuments {
  resultList;
  totalViewCountInfo;

  constructor(data) {
    this.resultList = data.resultList ? data.resultList :[];
    this.totalViewCountInfo = data.totalViewCountInfo ? data.totalViewCountInfo : 0;
  }

}