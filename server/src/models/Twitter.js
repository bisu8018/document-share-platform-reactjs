module.exports = ({ data, req }) => ({
  card: data && data.card ? data.card : 'summary_large_image',
  site: data && data.site ? data.site : '@Polarishare',
  title: data && data.title ? data.title : 'Polaris Share',
  description: data && data.description ? data.description : 'Sharing knowledge in new ways',
  image: data && data.image ? data.image : 'https://www.polarishare.com/logo.png',
  url: data && data.url ? data.url : `${req.protocol}://${req.get('host')}${req.originalUrl}`,
});
