// const path      = require('path');

var pckage    = require('../package')
  , path      = require('path');

var assets_in   = pckage.config.assets_in || path.join("test_assets");
var assets_out  = pckage.config.assets_out || path.join("app", "assets");
assets_out = path.join(assets_out)

var critical = pckage.critical_config

var img_ext  = pckage.img_config.ext || ['*.png', '*.gif', '*.jpg', '*.jpeg', '*.svg']

var config  = pckage.config;

var js = pckage.js_config;

var rails_server = (config.rails_port) ? "http://localhost:"+config.rails_port : "http://localhost:3030"

// var sprite_ext = pckage.sprite_config.ext || ["*.png", "*.gif"];

module.exports = {
  // Main assets output config
    assets_main      : assets_out
  // browserSync config
  , browserSync : {
      file   : ["app/views/**/*", "app/helpers/**/*"]
    , port   : Number(config.port) || 9090
    , proxy  : rails_server
    , server : config.name || "server"
    , uiport : Number(config.uiport) || 8080
  }
  // Images configuration
  , images : {
    ext    : img_ext
  , input  : path.join(assets_in, "images")
  , output : assets_out
  , temp   : path.join("tmp", "images")
  }
  // Javascript config
  , javascript : {
      ext    : js.ext || ['.js', ".es6.js"]
    , files  : js.files || ["components.es6.js"]
    , input  : path.join(assets_in, "javascripts")
    , output : js.output || path.join("app", "assets", "javascripts")
  }
  // SCSS config
  , stylesheets : {
    ext    : ['*.css', '*.css.map', "*.gz"]
  , input  : path.join(assets_in, "stylesheets")
  , output : assets_out
  , temp   : path.join("tmp", "stylesheets")
  }
}
