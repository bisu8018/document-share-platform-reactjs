export default class UserProfile {
  picture: string;
  signedUploadUrl: string;

  constructor(data) {
    this.signedUploadUrl = data && data.signedUploadUrl ? data.signedUploadUrl : "";
    this.picture = data && data.picture ? data.picture : "";
  }

}