const debug = require('./bouvier-debugger')(true);

module.exports = {
  BouvierError: function(type, description){
    return new BouvierError(type, description);
  },
  ErrorTypes: {
    NullObject: "<NullObject>",
    EmptyObject: "<EmptyObject>",
    ObjectDoesNotSatisfy: "<ObjectDoesNotSatisfy>",
    FileRead: "<FileRead>"
  }
};

function BouvierError(type, description){
  this.type = type;
  this.description = description;
  this.emit = function(){
    var errorText = "";
    errorText += (this.type + " :\n" + this.description + "\n");
    Error.captureStackTrace(this);
    var stackLines = this.stack.split("\n");
    for(var i = 1; i < 5; i++){
      errorText += (stackLines[i] + "\n");
    }
    debug.error("Report", errorText);
  }
}
