export default ({
  addMyList: data =>
  `  UserDocumentFavorite {
    addFavorite(documentId: "${data}") {
      documentId
      created
    }
  }`,
  removeMyList: data =>
  `  UserDocumentFavorite {
    removeFavorite(documentId: "${data}")
  }`,
  addHistory: data =>
    `  UserDocumentHistory {
    addHistory(documentId: "${data}") {
      documentId
      created
    }
  }`,
});
