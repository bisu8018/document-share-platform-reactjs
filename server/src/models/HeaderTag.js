const Twitter = require('./Twitter');
const Og = require('./Og');

module.exports = ({ data, req }) => ({
  title: data && data.title ? data.title : 'Polaris Share',
  seoTitle: data && data.seoTitle ? data.seoTitle : 'Polaris Share',
  description: data && data.description ? data.description : 'Sharing knowledge in new ways',
  twitter: data && data.twitter ? data.twitter : Twitter({ data, req }),
  og: data && data.og ? data.og : Og({ data, req }),
});
