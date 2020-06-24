const HeaderTag = require('../models/HeaderTag');


// SET API DATA
const apiData = req => Promise.resolve({
  headerData : HeaderTag({ req: req }),
  notFoundError: true,
  noindex: true,
});


module.exports = req => apiData(req);
