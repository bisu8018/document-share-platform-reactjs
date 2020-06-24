const buildHtml = require('./buildHtml');
const apis = require('./apis');
const ssr = require('../build/static/ssr').default;


module.exports = async (req, res) => {
  let data = {};

  if (/^\/static\//.test(req.path)) return;

  try {
    // 1. APP DATA initialization
    console.log('\n\nAPP DATA initialization . . .'.bold.yellow);
    const apiData = await apis(req);

    // google crawler no-index
    if(apiData.noindex) {
      res.header("X-Robots-Tag", "noindex");
    }

    // Check 404 ERROR
    if(apiData.notFoundError){
      console.log('404 NOT FOUND ERROR'.bgRed.bold.yellow);
      res.status(404);
    }

    console.log('. . . Complete\n'.bold.green);


    // 2. rendering initialization
    console.log('\nStart rendering initialization . . .'.bold.yellow);
    const rendered = await ssr(req, apiData.state);
    if (rendered.error) {
      data.html = rendered.html;
      res.send(buildHtml(data));
    }
    console.log('. . . Complete\n'.bold.green);


    // 3. DATA SET initialization
    console.log('\nDATA SET initialization . . .'.bold.yellow);
    data = {
      html: rendered.html,
      state: rendered.state,
      headerData: apiData.headerData
    };
    console.log('. . . Complete\n'.bold.green);


    res.send(buildHtml(data));
  } catch (e) {
    console.log('\nRendering error . . .'.bold.red, e);
    res.send(buildHtml());
  }
};

