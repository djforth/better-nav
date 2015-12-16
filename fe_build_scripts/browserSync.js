var _          = require("lodash")
  , browserify = require("./bs_helpers/bs_browserify")
  , config     = require("./config").browserSync
  , exec       = require('child_process').exec
  // , imageMin   = require("./bs_helpers/bs_images")
  // , manifest  = require("./config").manifest
  , pckage     = require("../package")
  , program    = require("commander")
  , sassBuild  = require("./bs_helpers/bs_sass");
  // , sys        = require('sys');

// folder.removeFile(manifest);
var checker;
var started = false;

function puts(error, stdout, stderr) {
  clearTimeout(checker);
  if(error){
    console.warn("error", error)
    setTimeout(check, 1000)
  } else {
    if(!started){
      // console.log("started >>>>>>>>>>>>>>>>>>>>>>>>>>>")
      startBS();
      started = true;
    }
  }
}

// function check(){
//   clearTimeout(checker);
//   exec("curl http://localhost:3030/", puts);
// }



// checker = setTimeout(check, 5000)

startBS();

function startBS(){
  // console.log("BrowserSync >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  // check();
  var bs = require("browser-sync").create(config.server);

  bs.emitter.on("browser:reload", function () {
    console.log("Browsersync is reloading!");
  });

  // Start a Browsersync static file server
  bs.init({
    browser: "google chrome"
    , files : ["app/*.html"]
    , port:config.port
    , reloadDebounce: 2000
    , startPath: "index.html"
    , server:"./app"
    , ui: {
        port: 8080
    }
  }, function callback() {
      // (server is now up)
      // set up watch to reload browsers when source changes
      browserify();
      sassBuild(true);
  });
}



// console.log("bs", bs);
