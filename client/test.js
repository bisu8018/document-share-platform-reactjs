'use strict';


// 환경변수 설정
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';


// unhandled rejection 을 무시하지 않고 스크립트 충돌 발생시킴.
// 그 후, unhandled Promise rejection 은 non-zero exit code와 함께 Node.js 프로세스 제거함.
process.on('unhandledRejection', err => {
  throw err;
});


// 환경변수 Read 체크 필요
require('../config/env');


const jest = require('jest');
const execSync = require('child_process').execSync;
let argv = process.argv.slice(2);


console.log("process.argv : ", process.argv);
console.log("process.env.CI : ", process.env.CI);


function isInGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function isInMercurialRepository() {
  try {
    execSync('hg --cwd . root', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Watch unless on CI or explicitly running all tests
if (
  !process.env.CI &&
  argv.indexOf('--watchAll') === -1
) {
  // https://github.com/facebook/create-react-app/issues/5210
  const hasSourceControl = isInGitRepository() || isInMercurialRepository();
  argv.push(hasSourceControl ? '--watch' : '--watchAll');
}


jest.run(argv);
