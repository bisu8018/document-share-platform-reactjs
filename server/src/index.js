const express = require('express');
const path = require('path');
const render = require('./render');
const colors = require('colors');
let datetime = new Date();

const app = express();
const port = 80;

app.get('/', render);

app.use(express.static(path.resolve('build')));
app.use(render);

app.listen(port, () => {
  console.log('Server Start'.bold.bgGreen);
  console.log('Date Time : '.bold + datetime);
  console.log('Listening Port : '.bold + port);
});
