export default class CuratorDocuments {
  resultList: [];
  pageNo: number;
  totalViewCountInfo: any;
  latestRewardVoteList: any;
  count: number;

  constructor(data) {
    this.resultList = data.resultList ? data.resultList : [];
    this.count = data.count ? data.count : 0;
    this.pageNo = data.pageNo ? data.pageNo : 0;
    this.totalViewCountInfo = data.totalViewCountInfo ? data.totalViewCountInfo : {};
    this.latestRewardVoteList = data.latestRewardVoteList ? data.latestRewardVoteList : {};
  }

}