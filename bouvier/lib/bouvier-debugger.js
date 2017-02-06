const colors = require('colors');

module.exports = (enabled) => {
  return new Debug(enabled);
};

function Debug(enabled) {
  this.enabled = enabled;

  this.error = function(head, body){
    if(this.enabled){
      console.log("[Bouvier-Error][".white + head.red + "]: ".white + body.white);
    }
  };

  this.log = function(head, body){
    if(this.enabled){
      console.log("[Bouvier-Log][".white + head.cyan + "]: ".white + body.white);
    }
  };
}
