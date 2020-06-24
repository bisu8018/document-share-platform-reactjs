const DocService = require('../service/DocService');
const TagService = require('../service/TagService');
const HeaderTag = require('../models/HeaderTag');


// SET API DATA
const apiData = async req => ({
  headerData: HeaderTag({ req: req }),
  state: {
    main: {
      documentList:
        await DocService.documentList()
          .catch(err => {}),

      tagList:
        await TagService.tagList('latest')
          .then(res => res.resultList)
          .catch(err => [])
    }
  },
  noindex: true,
  notFoundError: true,
});


module.exports = req => apiData(req);
