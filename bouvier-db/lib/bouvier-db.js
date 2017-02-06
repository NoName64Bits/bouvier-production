const mongoose = require('mongoose');

module.exports = {
  obj: function(base, options) {
    if(!options.db){
      var err = base.error.BouvierError(base.error.ErrorTypes.ObjectDoesNotSatisfy, "No Databse URL specifieed!");
      err.emit();
      return;
    }

    this.registredModels = {};

    mongoose.connect(options.db);

    this.registerModel = (name, schema) => {
      var md = mongoose.model(name, schema);
      this.registredModels[name] = md;
      return md;
    };

    this.model = (name) => {
      return this.registredModels[name];
    };

    function log(text){
      base.debug.log(module.exports.name, text);
    }

    function reportErr(text){
      base.debug.error(module.exports.name, text);
    }
  },
  name: "BouvierDb"
}
