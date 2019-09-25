export default ({
  getMyListFindMany: data =>
    `
    UserDocumentFavorite {
    findMany(filter: { userId: "${data}" }) {
      documentId
    }
  }`,
  getHistoryFindById: data =>
    `
    UserDocumentHistory {
    findMany(
    filter: { userId: "${data}" },
    limit: 10
    ) {
      documentId
    }
  }`,
  getDocumentListByIds: data =>
    `Document {
    findByIds(_ids: [${data}]) {
      _id
      created
      state
      accountId
      documentId
      documentName
      documentSize
      ethAccount
      title
      desc
      seoTitle
      useTracking
      forceTracking
      isDownload
      cc
      isPublic
      isBlocked
      isDeleted
      dimensions {
        width
        height
        type
      }
    }
  }
  DocumentFeatured {
    findByIds(_ids: [${data}]) {
      _id
      latestVoteAmount
    }
  }
  DocumentPopular {
    findByIds(_ids: [${data}]) {
      _id
      latestPageview
    }
  }`,
  getUserByIds: data =>
    `  User {
      findByIds(_ids: [${data}]) {
      _id
      created
      username
      email
      picture
      local
      nickname
      family_name
      ethAccount
    }
  }`
});
