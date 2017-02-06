module.exports = Bouvier;

const path = require('path');
const fs = require('fs');

const debug = require('./bouvier-debugger')(true);
const error = require('./bouvier-error');

function Bouvier(app, options){
  if(typeof options == 'undefined'){
    options = {};
  }

  this.options = options;
  this.server = app;

  this.local = this.options.local ? this.options.local : path.join(__dirname, '../../../');
  this.modules = this.options.modules ? this.options.modules : [];
  this.registred = {};

  debug.log("MainTask", "Loading " + this.modules.length + (this.modules.length != 1 ? " modules" : " module"));
  for(var i = 0; i < this.modules.length; i++){
    if(typeof this.modules[i][1] == 'undefined'){
      var err = error.BouvierError(error.ErrorTypes.NullObject, this.modules[i][0] + " - Module may not be a NULL object!");
      err.emit();
      return;
    }

    if(Object.keys(this.modules[i][1]).length < 1){
      var err = error.BouvierError(error.ErrorTypes.EmptyObject, this.modules[i][0] + " - Module may not be an EMPTY object!");
      err.emit();
      return;
    }

    if(!this.modules[i][1].name){
      var err = error.BouvierError(error.ErrorTypes.ObjectDoesNotSatisfy, this.modules[i][0] + " - Module is not valid!");
      err.emit();
      return;
    }

    var vet = this;
    vet.debug = debug;
    vet.error = error;

    this.registred[this.modules[i][0]] = new this.modules[i][1].obj(vet, this.modules[i][2]);
    debug.log(this.modules[i][1].name, "Loaded module as <" + this.modules[i][0] + ">");
  }

  this.remove = (module) => {
    this.registred[module] = null;
    this.registred.clean(null);
  };

  this.module = (module) => {
    return this.registred[module];
  };

  this.readFile = (file, callback) => {
    fs.readFile(file, (err, data) => {
      callback(err, data.toString());
    });
  }

  this.readFileSync = (file) => {
    return fs.readFileSync(file).toString();
  }

  this.writeFile = (file, content, append) => {
    if(!append){
      fs.writeFile(file, content);
    } else {
      fs.appendFile(file, content);
    }
  }
}
