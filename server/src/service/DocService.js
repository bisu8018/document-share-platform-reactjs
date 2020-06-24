const SERVICE = require('./Service');
const getDocumentUrl = 'document/info';
const getDocumentListUrl = 'document/list';

module.exports = {
  document: data => SERVICE.request(getDocumentUrl + '/' + data),
  documentList: () => SERVICE.request(getDocumentListUrl)
};
