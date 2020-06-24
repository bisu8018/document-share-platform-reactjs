const APP_PROPERTIES = require('../properties/app.properties');


const SERVICE = {
  DEBUG: APP_PROPERTIES.debug,
  getRootUrlWithApi: APP_PROPERTIES.domain().api + '/api/',
  request: url => {
    return new Promise((resolve, reject) => {
      let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
      let xhr = new XMLHttpRequest();

      xhr.open('GET', SERVICE.getRootUrlWithApi + url, true);

      console.log('\nXMLHttpRequest Start . . .'.bold.yellow);
      console.log('Request URL : '.bold + SERVICE.getRootUrlWithApi + url);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          if(res.message) {
            console.log('Error'.red, res.message);
            reject(res.message);
          }else{
            resolve(res);
            console.log('Complete'.green);
          }
        }else if(xhr.readyState === 4 && xhr.status !== 200) {
          console.log('Error'.red);
          reject();
        }
      };

      xhr.send(null);
    });
  },
};

module.exports = SERVICE;
