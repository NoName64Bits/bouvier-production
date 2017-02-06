'use strict';

module.exports = function(app, options) {
  var Bouvier = require('./lib/bouvier.js');
  return new Bouvier(app, options);
}
