export default class Document {
  document : any;
  featuredList : [];
  totalViewCountInfo: any;
  author : any;
  text : string;

  constructor(data) {
    this.document = data.document ? data.document :{};
    this.totalViewCountInfo = data.totalViewCountInfo ? data.totalViewCountInfo :{};
    this.author = data.author ? data.author :{};
    this.featuredList = data.featuredList ? data.featuredList : [];
    this.text = data.text ? data.text : "";
  }

}