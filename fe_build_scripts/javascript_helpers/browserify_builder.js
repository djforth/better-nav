var browserify = require('browserify')
 , babelify    = require("babelify")
 , browserSync = require("browser-sync")
 , config      = require("../config").javascript
 , es          = require('event-stream')
 , folder      = require('../utils/folder_helpers')
 , fs          = require('fs')
 , path        = require('path')
 // , UglifyJS    = require("uglify-js")
 , watchify    = require("watchify");

var inPaths  = fileIn(config.input)
var outPaths = fileRegExp(config.ext, config.output);


// function uglifyScript(file){
//   var result = UglifyJS.minify(file);
//   // console.log(result.code);
//   fs.writeFile(file.replace(".js", ".min.js"), result.code, function(err) {
//       if(err) {
//           return console.error(err);
//       }

//       console.log("Minified "+file);
//   });
// }

function fileRegExp(exts_in, output, ext){
  ext = ext || ".js"
  var ext_str  = exts_in.join("|");
  var regex    = new RegExp("("+ext_str+")$");
  var out_path = output
  return function(name){
    return path.join(out_path, name.replace(regex, ext));
  }
}

function fileIn(input){
  var in_path= input;
  return function(file){
    return path.join(in_path, file)
  }
}

function writeFile(file, minify, bs){
  var filePath = outPaths(file);
  var mini     = minify
  return function(){
    var wr = fs.createWriteStream(filePath);
    wr.on("error", function(err) {
        console.error('err', err);
      });
    wr.on("close", function(ex) {
      //Minifiy if required

      // if(mini)
      //   uglifyScript(outPaths(file))
      console.log("file", filePath)
      if(bs)
        bs();
    });

    return wr
  }

}

function bundleShare(b, writer) {
  // var wr = writeFile(file, minify);
  b.bundle()
   .on('data', function(err){
    if(err.message)
      console.log(err.toString());
      // this.close();
    })
   .on("error", function(err){
    if(err.message)
      console.error(err.toString());
      // this.close();
    })
   .pipe(writer())

}


module.exports = function(file, watch, minify, server){
  watch  = watch || false;
  minify = minify || false;
  // var bs;
  // if(server){
  //   bs = browserSync.get(server);
  //   console.log('bs', bs.name);
  //   bs.reload();
  // }

  var b = browserify({entries: [inPaths(file)], extensions:config.ext, debug:true, cache: {}, packageCache: {}})

  var writer = writeFile(file, minify, server);

  b.transform("babelify", {presets: ["es2015", "react"]});

  if(watch){
    console.log("watching")
    var w = watchify(b);
    w.on("update", function(d){
      console.log("compiling", d.toString())
      bundleShare(w, writer);
    })

    bundleShare(w, writer);
  } else {
    b.bundle()
    .pipe(writer());

  }



}