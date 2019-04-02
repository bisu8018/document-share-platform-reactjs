export default class UserProfile {
  picture;
  signedUploadUrl;

  constructor(data) {
    this.signedUploadUrl = data && data.signedUploadUrl ? data.signedUploadUrl : "";
    this.picture = data && data.picture ? data.picture : "";
  }

}