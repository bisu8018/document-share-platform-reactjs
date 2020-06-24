const SERVICE = require('./Service');
const tagListUrl = "tags";

module.exports = {
    tagList: data => SERVICE.request(tagListUrl + '?' + data),
};
