export default class AnalysticsExport {
  csvDownloadUrl;

  constructor(data) {
    this.csvDownloadUrl = data && data.csvDownloadUrl ? data.csvDownloadUrl : "";
  }

}