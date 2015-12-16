var configuration = require("./config")
 , folder    = require('./utils/folder_helpers')
 , sassBuild = require('./css_helpers/sass_multi')
 , program   = require('commander')
 , watchFolder = require("./utils/watcher");

var img_conf = configuration.images;
var config   = configuration.stylesheets;

var img_ext = img_conf.ext;
var css_ext = config.ext;

program
  .version('0.0.1')
  .option('-m, --minify' , 'minify scripts')
  .option('-w, --watch', 'Watch scripts')
  .parse(process.argv);

folder.clearFolder(
      config.output
    , config.ext
    , function(){
      console.log("cleared " + config.output);
      sass();
    });

function sass(){
  sassBuild(null, program.watch);
}
