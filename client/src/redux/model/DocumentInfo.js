import Common from "../../common/common";

export default class DocumentInfo {
  accountId: string;
  author: {};
  cc: [];
  created: number;
  desc: string;
  dimension: {};
  documentId: string;
  documentName: string;
  documentSize: number;
  ethAccount: string;
  forceTracking: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  isDownload: boolean;
  isPublic: boolean;
  isRegistry: boolean;
  pdf: boolean;
  pdfBase64: boolean;
  seoTitle: string;
  state: string;
  tags: [];
  title: string;
  totalPages: number;
  updated: string;
  viewCount: number;
  useTracking: boolean;
  _id: string;

  constructor(data) {
    this.accountId = data && data.accountId ? data.accountId : "";
    this.author = data && data.author ? data.author : {};
    this.cc = data && data.cc ? data.cc : [];
    this.created = data && data.created ? data.created : 0;
    this.desc = data && data.desc ? data.desc : "";
    this.dimension = data && data.dimension ? data.dimension : {};
    this.documentId = data && data.documentId ? data.documentId : "";
    this.documentName = data && data.documentName ? data.documentName : "";
    this.documentSize = data && data.documentSize ? data.documentSize : 0;
    this.ethAccount = data && data.ethAccount ? data.ethAccount : "";
    this.forceTracking = data && data.forceTracking ? data.forceTracking : false;
    this.isBlocked = data && data.isBlocked ? data.isBlocked : false;
    this.isDeleted = data && data.isDeleted ? data.isDeleted : false;
    this.isDownload = data && data.isDownload ? data.isDownload : false;
    this.isPublic = data && data.isPublic ? data.isPublic : false;
    this.isRegistry = data && data.isRegistry ? data.isRegistry : false;
    this.pdf = data && data.pdf ? data.pdf : false;
    this.pdfBase64 = data && data.pdfBase64 ? data.pdfBase64 : false;
    this.seoTitle = data && data.seoTitle ? data.seoTitle : null;
    this.state = data && data.state ? data.state : "";
    this.tags = data && data.tags ? data.tags : [];
    this.title = data && data.title ? data.title : "";
    this.totalPages = data && data.totalPages ? data.totalPages : 0;
    this.updated = data && data.updated ? data.updated : Common.timestampToDateTime();
    this.viewCount = data && data.viewCount ? data.viewCount : 0;
    this.useTracking = data && data.useTracking ? data.useTracking : false;
    this._id = data && data._id ? data._id : "";
  }

}
