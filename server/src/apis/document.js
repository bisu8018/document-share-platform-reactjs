const DocService = require('../service/DocService');
const HeaderTag = require('../models/HeaderTag');
const { domain } = require('../properties/app.properties');


// SET API DATA
const apiData = async (req, res) => ({
  headerData: setHeaderData(req, res),
  state: {
    contentView: { document: res, }
  },
  notFoundError: false,
  noindex: false
});


// SET header DATA
const setHeaderData = (req, data) => ({
  title: data && data.document.title ? data.document.title : 'Polaris Share',
  seoTitle: data && data.document.seoTitle ? data.document.seoTitle : 'Polaris Share',
  description: data && data.document.desc ? data.document.desc : 'Sharing knowledge in new ways',
  twitter: {
    card: data && data.card ? data.card : 'summary_large_image',
    site: data && data.site ? data.site : '@Polarishare',
    title: data && data.document.title ? data.document.title : 'Polaris Share',
    description: data && data.document.desc ? data.document.desc : 'Sharing knowledge in new ways',
    image: data ?
      domain().image + '/' + data.document.documentId + '/' + 1024 + '/' + 1
      : 'https://www.polarishare.com/logo.png',
    url: data && data.document.shortUrl ? data.document.shortUrl : `${req.protocol}://${req.get('host')}${req.originalUrl}`,
  },
  og: {
    site_name: data && data.card ? data.card : 'Polaris Share',
    type: data && data.site ? data.site : 'website',
    title: data && data.document.title ? data.document.title : 'Polaris Share',
    description: data && data.document.desc ? data.document.desc : 'Sharing knowledge in new ways',
    image_width: '720',
    image_height: data && data.document.dimensions ?
      Math.floor(Number((data.document.dimensions.height * 720) / data.document.dimensions.width))
      : '498',
    url: data && data.document.shortUrl ? data.document.shortUrl : `${req.protocol}://${req.get('host')}${req.originalUrl}`,
  },
});


module.exports = async req =>
  await DocService.document(req.url.split('/')[2])
    .then(res => apiData(req, res))
    .catch(res => ({
        headerData: HeaderTag({ req: req }),
        notFoundError: true,
        noindex: false
      })
    );
