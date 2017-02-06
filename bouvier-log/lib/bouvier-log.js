const path = require('path');
const fs = require('fs');
const responseTime = require('response-time');

module.exports = {
  obj: function(base, options) {
    base.server.use(responseTime((req, res, time) => {
      log(req.method + "\t" + req.url + "\t" + res.statusCode + "\t" + Math.round(Number(time)) + " ms");
    }));

    function log(text){
      base.debug.log(module.exports.name, text);
    }

    function reportErr(text){
      base.debug.error(module.exports.name, text);
    }
  },
  name: "BouvierLog"
}
