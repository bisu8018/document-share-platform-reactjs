export default class DocumentInfo {
  accountId;
  created;
  desc;
  documentId;
  documentName;
  documentSize;
  ethAccount;
  seoTitle;
  state;
  tags;
  title;
  totalPages;
  updated;
  viewCount;
  _id;

  constructor(data) {
    this.accountId = data.accountId ? data.accountId :"";
    this.created = data.created ? data.created :0;
    this.desc = data.desc ? data.desc :"";
    this.documentId = data.documentId ? data.documentId :"";
    this.documentName = data.documentName ? data.documentName :"";
    this.documentSize = data.documentSize ? data.documentSize : 0;
    this.ethAccount = data.ethAccount ? data.ethAccount :"";
    this.seoTitle = data.seoTitle ? data.seoTitle :"";
    this.state = data.state ? data.state :"";
    this.tags = data.tags ? data.tags : [];
    this.title = data.title ? data.title :"";
    this.totalPages = data.totalPages ? data.totalPages :0;
    this.updated = data.updated ? data.updated :0;
    this.viewCount = data.viewCount ? data.viewCount :0;
    this._id = data._id ? data._id : "";
  }

}