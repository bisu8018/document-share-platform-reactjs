module.exports = ({ data, req }) => ({
    site_name : data && data.card ? data.card : 'Polaris Share',
    type : data && data.site ? data.site : 'website',
    title : data && data.title ? data.title : 'Polaris Share',
    description : data && data.description ? data.description : 'Sharing knowledge in new ways',
    image_width : data && data.image ? data.image : '720',
    image_height : data && data.image ? data.image : '498',
  url: data && data.url ? data.url : `${req.protocol}://${req.get('host')}${req.originalUrl}`,
});
