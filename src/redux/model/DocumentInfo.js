import Common from "../../util/Common";

export default class DocumentInfo {
  accountId: string;
  created: number;
  desc: string;
  documentId: string;
  documentName: string;
  documentSize: number;
  ethAccount: string;
  seoTitle: string;
  state: string;
  tags: [];
  title: string;
  totalPages: number;
  updated: string;
  viewCount: number;
  _id: string;

  constructor(data) {
    this.accountId = data.accountId ? data.accountId : "";
    this.created = data.created ? data.created : 0;
    this.desc = data.desc ? data.desc : "";
    this.documentId = data.documentId ? data.documentId : "";
    this.documentName = data.documentName ? data.documentName : "";
    this.documentSize = data.documentSize ? data.documentSize : 0;
    this.ethAccount = data.ethAccount ? data.ethAccount : "";
    this.seoTitle = data.seoTitle ? data.seoTitle : "";
    this.state = data.state ? data.state : "";
    this.tags = data.tags ? data.tags : [];
    this.title = data.title ? data.title : "";
    this.totalPages = data.totalPages ? data.totalPages : 0;
    this.updated = data.updated ? data.updated : Common.timestampToDateTime();
    this.viewCount = data.viewCount ? data.viewCount : 0;
    this._id = data._id ? data._id : "";
  }

}