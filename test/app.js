const express = require('express');
var app = express();

var bouvierOptions = {
  modules: [
    ['render', require('bouvier-engine'), {mainLayout: 'main'}],
//    ['database-controller', require('bouvier-engine'), {}]
//    ['local-login', require('bouvier-login-local'), {}]
  ]
};

const bouvier = require('bouvier')(app, bouvierOptions);

bouvier.module('render').helper('help', (text) => {
  return "this is the text: " + text;
});

//bouvier.module('render').test('main', 'home');

app.get('/', (req, res) => {
  res.render('home', {shit: "shittttt", shit2: "shit2"});
});

app.listen(3000);
