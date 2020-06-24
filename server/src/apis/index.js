const fs = require('fs');


// 파일명 배열로 추출
const files = fs.readdirSync('./src/apis')
  .filter(value => value !== 'index.js');
files.forEach((v, i) => files[i] = v.split('.')[0]);


// GET path name
const getPathName = req => Promise.resolve(req.url.split('/'));


// Match path name
const matchPathName = pathname => {
  let api = 'main';
  if (pathname[1][0] === '@' && pathname[2]) {
    api = 'document';
  } else if (pathname[1][0] === '@' && !pathname[2]) {
    if(!pathname[1][0].substring(1))api = 'n';
    else api = 'profile';
  } else if (pathname[1]) {
    api = pathname[1];
  }

  console.log('pathName : '.bold, pathname);
  console.log('api : '.bold + api);

  return Promise.resolve(api);
};


// SET path name : file 명과 일치하는 path name 없을 경우, notFound 페이지 로드
const setPathName = res => Promise.resolve(files.find(item => item === res) || 'n');


// path name 의 JS 파일 import
const getTmpData = pathName => require(`./${pathName}`);


module.exports = req =>
  getPathName(req)
    .then(pathname => matchPathName(pathname))
    .then(res => setPathName(res))
    .then(async pathName => await getTmpData(pathName))
    .then(res => res(req));
