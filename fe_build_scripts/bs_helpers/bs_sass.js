var _        = require("lodash")
  , bs        = require("./bs_helper")
  , configuration = require("../config")
  , folder    = require('../utils/folder_helpers')
  , sassBuild = require('../css_helpers/sass_multi');

var img_conf = configuration.images
  , config   = configuration.stylesheets
  // , name     = configuration.browserSync.server
  , img_ext  = img_conf.ext
  , css_ext  = config.ext


module.exports = function(watch){
  watch = (_.isBoolean(watch)) ? watch : false;
  // console.log('watch >>>>>', watch);
  folder.clearFolder(
      config.output
    , config.ext
    , function(){
      console.log("cleared " + config.output);
      sass();
    }
  );

  function sass(){
    sassBuild(bs(), watch);
  }
}
