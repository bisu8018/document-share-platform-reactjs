export default class Document {
  document;
  featuredList;
  text;

  constructor(data) {
    this.document = data.document ? data.document :{};
    this.featuredList = data.featuredList ? data.featuredList : [];
    this.text = data.text ? data.text : "";
  }

}