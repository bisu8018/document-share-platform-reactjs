export default class Document {
  document : any;
  featuredList : [];
  totalViewCountInfo: any;
  text : string;

  constructor(data) {
    this.document = data && data.document ? data.document :{};
    this.totalViewCountInfo = data && data.totalViewCountInfo ? data.totalViewCountInfo :{};
    this.featuredList = data && data.featuredList ? data.featuredList : [];
    this.text = data && data.text ? data.text : "";
  }
}
