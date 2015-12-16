var _           = require('lodash')
  , browserSync = require("browser-sync")
  , serverName  = require("../config").browserSync.server;

module.exports =  function (name){
  name = name || serverName;
  console.log("name: %j", name)
  var server;
  if(name){
    server = browserSync.get(name);
  } else {
    return null;
  }

  return function(file){
    if(_.isUndefined(server)){
      // console.log("server", server)
      return null;
    }
    if(file){
      server.reload(file);
    } else {
      server.reload();
    }
  }
}
