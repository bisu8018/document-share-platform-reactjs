export default class Document {
  document;
  featuredList;

  constructor(data) {
    this.document = data.document ? data.document :{};
    this.featuredList = data.featuredList ? data.featuredList : [];
  }

}