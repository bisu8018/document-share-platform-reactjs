export default class AnalyticsList {
  csvDownloadUrl;
  isWeekly;
  resultList;

  constructor(data) {
    this.csvDownloadUrl = data.csvDownloadUrl ? data.csvDownloadUrl :"";
    this.isWeekly = data.isWeekly ? data.isWeekly : false;
    this.resultList = data.resultList ? data.resultList : [];
  }

}