export default class TrackingExport {
  downloadUrl: string;

  constructor(data) {
    this.downloadUrl = data && data.downloadUrl ? data.downloadUrl : "";
  }

}