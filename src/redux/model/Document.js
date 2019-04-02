export default class Document {
  document;
  featuredList;
  author;
  text;

  constructor(data) {
    this.document = data.document ? data.document :{};
    this.author = data.author ? data.author :{};
    this.featuredList = data.featuredList ? data.featuredList : [];
    this.text = data.text ? data.text : "";
  }

}