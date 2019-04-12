export default class Document {
  document : any;
  featuredList : [];
  author : any;
  text : string;

  constructor(data) {
    this.document = data.document ? data.document :{};
    this.author = data.author ? data.author :{};
    this.featuredList = data.featuredList ? data.featuredList : [];
    this.text = data.text ? data.text : "";
  }

}