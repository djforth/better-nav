var _           = require('lodash')
  , config      = require("../config").stylesheets
  , es          = require('event-stream')
  , folder      = require('../utils/folder_helpers')
  , fs          = require('fs')
  , path        = require('path')
  , sassBuild   = require('./sass_builder')
  , sassStream  = require("./sass_stream")
  , watchFolder = require("../utils/watcher");



// Processing watched files
function sassFiles(bs){
  var sass_list = [];
  var sync      = bs;

  var processSass = function(file, cb){
    sassBuild(file, {}, cb);
  }

  var find = function(path){
    return _.find(sass_list, function(f){
      if(f.fullPath)
        return path.indexOf(f.fullPath) !== -1
      return false
    })
  }

  return {
    add:function(file){
      sass_list.push(file);
      // console.log("add", file);
    }
    , process:function(scss){
        // console.log("eh")
        var details = find(scss);
        if(details)
          processSass(details, function(){
            if(sync)
              console.log("SCSS >>>>>>>>>>>>", details.output)
              sync();
          });
      }
    , processAll:function(){
      // console.log("eh * 2")
      es.readArray(sass_list)
        .on("end", function(){
          if(sync)
            console.log("SCSS >>>>", _.pluck(sass_list, "output"))
            sync();
        })
       .pipe(es.through(function(scss){
          this.pause();
          processSass(scss, function(){
            this.resume();
          }.bind(this));

          return scss
        },
        function end() { //optional
          this.emit('end')
        }));
    }
  }
}


module.exports = function sass(server, watch, cb){

  var sassHolder = sassFiles(server);

  if(watch){
    var watcher = watchFolder(config.input
      , function(fileName, path){
        if(fileName.match(/^_(\w*)(.scss$)/)){
          sassHolder.processAll();
        } else if (fileName.match(/.scss$/)){
          sassHolder.process(path);
        }
      }
    );
  }

  var streamer =  sassStream(config.input, config.output);
  streamer
    .addCallBack(cb, "end")
    .addCallBack(function(file){
      console.log("In progress")
      if(server){
        server(file.output);
      }
    }, "progress")
    .addType("nested")
    .addStream(function(file){
        if(file && watcher){
          if(file.scss){
            sassHolder.add(file)
          }
          watcher.add(file.fullPath)
        }
        return file;
      })
    .stream();
}
