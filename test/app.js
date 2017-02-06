const express = require('express');
var app = express();

var bouvierOptions = {
  modules: [
    ['log', require('bouvier-log'), {}],
    ['render', require('bouvier-engine'), {mainLayout: 'main'}],
    ['db', require('bouvier-db'), {db: "mongodb://127.0.0.1:27017/bouvier"}]
//    ['local-login', require('bouvier-login-local'), {}]
  ]
};

const bouvier = require('bouvier')(app, bouvierOptions);

bouvier.module('render').helper('help', (text) => {
  return "this is the text: " + text;
});

var Cat = bouvier.module('db').registerModel('Cat', {name: String, age: Number});


app.get('/', (req, res) => {
  Cat.find({}, ['name', 'age'], {sort: {name: 1}}, (err, cats) => {
    res.render('home', {cats: cats});
  });
});

app.get('/hel', (req, res) => {
  res.json({api: "apii"});
});

app.listen(3000);
