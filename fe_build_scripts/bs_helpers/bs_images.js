var _           = require('lodash')
  , bs          = require("./bs_helper")
  // , chokidar    = require("chokidar")
  , imagemin    = require('../image_helpers/imagemin_helper')
  , config      = require("../config").images
  , es          = require('event-stream')
  , folder      = require('../utils/folder_helpers')
  , watchFolder = require("../utils/watcher");

  folder.clearFolder(
        config.output
      , config.ext
      , function(){
        console.log("cleared " + config.output)
      })


function squishImage(input, output, bs){
  imagemin(
        input
      , output
      , function(){
        if(bs)
          bs();
      })
}


module.exports = function(name){
  var ext_list = config.ext.join(",").replace(/\*./g, "");
  var img_path = config.input+"/**/*.{"+ext_list+"}";

  var server = bs();


  var resquish = function(fileName, path){
    //on change or add
    squishImage(config.input, config.output, server)
  }


  var watcher = watchFolder(
    config.input, resquish , resquish
  );

  squishImage(config.input, config.output);
}
