var _           = require('lodash')
  , config      = require("../config").stylesheets
  , es          = require('event-stream')
  , folder      = require('../utils/folder_helpers')
  , fs          = require('fs')
  , path        = require('path')
  , sassBuild   = require('./sass_builder')



var processCSS = function(file){
  var ext = path.extname(file.name);
  if(ext !== ".css") return false

  return {
    fullPath:file.fullPath
    , name:file.name
    , scss:false
  }
}

var processSCSS = function(file, output, type){

  return {
      fullPath:file.fullPath
    , comments:true
    , name:file.name.replace(".scss", ".css")
    , output:output+"/"+file.name.replace(".scss", ".css")
    , scss:true
    , type: type || "nested"
  }
}

var checker = function(file) {
  var ext = path.extname(file.name);

  return (file.name.match(/^_/) || ext !== ".scss")
}

var copyCSS = function(file, output, cb){
  folder.copyFile(
      file.fullPath
    , path.join(output, file.name)
    , cb)
}



var processStylesheets = function(file, output, data, cb){

  if(file.scss){
    sassBuild(file, data, cb)
  } else {
    folder.copyFile(file.fullPath
      , path.join(output, file.name)
      , cb)
  }
}


module.exports = function(input, output){
  var cb, stream, data, compression;
  cb   = {};
  data = {};

  return {
    addCallBack:function(func, type){
      if(_.isFunction(func)){
        cb[type] = func
      }
      // console.log("callback >>><>>>>>", this)
      return this;
    }

    , addData:function(d){
      data = d;
      return this;
    }

    , addStream:function(func){
      if(_.isFunction(func)){
        stream = func
      }

      return this;
    }

    , addType:function(t){
      compression = t;
      return this;
    }

    , stream:function(){
      var scss_list = folder.getFiles(input)
      scss_list
      .on("end", function(){
        var callback = _.get(cb, "end")
        if(_.isFunction(callback)){
          callback();
        }
      })
      //Process Files ready to process
      .pipe(es.mapSync(function(file){
        return (checker(file)) ? processCSS(file) : processSCSS(file, output, compression);

      })
      )
      .pipe(es.through(function(file){
        var callback = _.get(cb, "process")
        var binder = _.bind(processStylesheets, {}, file, output, data);

        this.emit('data', file)
        if(file){
          this.pause();
          binder(function(){
              this.resume();
              if(callback) callback(file);
            }.bind(this)
          );
        }

        return file;
        })
      )
      .pipe(es.mapSync(function(file){
          // console.log("stream")
          if(stream){
            return stream(file)
          }
          return file;
        })
      )
    }
    // Stream end

  };
  // Return end
}
