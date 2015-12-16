var config   = require("../config")
 // , es       = require('event-stream')
 , folder   = require('./folder_helpers')
 , fs       = require('fs');

var img_ext = config.images.ext;
var css_ext = config.stylesheets.ext;

 //Sets and clears folder
folder.folder(config.assets_main);

folder.clearFolder(
      config.assets_main
    , img_ext.concat(css_ext)
    , function(){
      console.log("cleared assets")
    });

fs.access(config.manifest, function(err){
  if(err)
    console.log("manifest not there")
  else
    fs.unlinkSync(config.manifest);
});
