const path = require('path');
const fs = require('fs');

module.exports = {
  obj: function(base, options) {
    if(!options.mainLayout){
      var err = base.error.BouvierError(base.error.ErrorTypes.ObjectDoesNotSatisfy, "Options object should contain a 'mainLayout' property!")
      err.emit();
    }

    this.viewsPath = options.views ? options.views : path.join(base.local, '/views');
    this.layoutsPath = options.layouts ? options.layouts : path.join(base.local, '/layouts');
    this.partialsPath = options.partials ? options.partials : path.join(base.local, '/partials');

    this.currentLayout = options.mainLayout;
    this.layout = (lay) => {
      if(!lay){
        rhis.currentLayout = options.mainLayout;
        return;
      }
      this.currentLayout = lay;
    };

    base.server.set('views', this.viewsPath);
    base.server.engine('bov', render);
    base.server.set('view engine', 'bov')

    this.helpers = {};
    this.helper = (name, hlp) => {
      log("Registred <" + name + "> helper");
      this.helpers[name] = hlp;
    };

    this.test = constructLayout;

    var vet = this;

    function render(pth, ops, callback) {
      base.readFile(pth, (err, content) => {
        if(err)
          return callback(err);

        return callback(null, parseView(constructLayout(vet.currentLayout, content), {
          content: ops,
          helpers: vet.helpers,
        }));
      });
    };

    function constructLayout(layout, view){
      var data = base.readFileSync(path.join(vet.layoutsPath, layout + ".bov"));
      data = data.replace("#{body}", view);
      var line = /#import (.+)/g;
      var matches = data.match(line);
      for(var i = 0; i < matches.length; i++){
        var mtch = matches[i];
        var partial = /#import (.+)/g.exec(matches[i])[1];
        data = data.replace(mtch, base.readFileSync(path.join(vet.partialsPath, partial + ".bov")));
      }
      return data;
    };

    function parseView(html, options) {
       var re = new RegExp("<bov(.+?)/>", "g"),
         reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g,
         code = 'with(obj) { var r=[];\n',
         cursor = 0,
         result,
         match;

       var add = function(line, js) {
         js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
           (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
         return add;
       }

       while(match = re.exec(html)) {
         add(html.slice(cursor, match.index))(match[1], true);
         cursor = match.index + match[0].length;
       }

       add(html.substr(cursor, html.length - cursor));
       code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, ' ');
       try { result = new Function('obj', code).apply(options, [options]); }
       catch(err) { reportErr("'" + err.message + "'"); }
       return result;
    }

    function log(text){
      base.debug.log(module.exports.name, text);
    }

    function reportErr(text){
      base.debug.error(module.exports.name, text);
    }
  },
  name: "BouvierEngine"
}
