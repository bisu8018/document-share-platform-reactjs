export default class UserInfo {
  connected: any;
  email : string;
  family_name: string;
  locale: string;
  name: string;
  nickname: string;
  picture: string;
  provider: string;
  sub: string;
  username: string;

  constructor(data) {
    this.connected = data && data.connected ? data.connected : 0;
    this.email = data && data.email ? data.email :"";
    this.family_name = data && data.family_name ? data.family_name :"";
    this.locale = data && data.locale ? data.locale :"";
    this.name = data && data.name ? data.name : 0;
    this.nickname = data && data.nickname ? data.nickname :"";
    this.picture = data && data.picture ? data.picture :"";
    this.provider = data && data.provider ? data.provider :"";
    this.sub = data && data.sub ? data.sub :"";
    this.username = data && data.username ? data.username :"";
  }

}