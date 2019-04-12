export default class AnalysticsExport {
  csvDownloadUrl: string;

  constructor(data) {
    this.csvDownloadUrl = data && data.csvDownloadUrl ? data.csvDownloadUrl : "";
  }

}