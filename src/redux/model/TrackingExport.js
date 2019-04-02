export default class TrackingExport {
  downloadUrl;

  constructor(data) {
    this.downloadUrl = data && data.downloadUrl ? data.downloadUrl : "";
  }

}