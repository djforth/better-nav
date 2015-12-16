var sass         = require('node-sass')
  , create       = require('../utils/folder_helpers')
  , globbing     = require('node-sass-globbing')
  , postCSSHelper = require("./postcss_helper")
  , sass_helpers = require('./sass_helpers');



module.exports = function(details, data, cb){
  sass.render({
    file: details.fullPath,
    data: '',
    includePaths: [ 'bower_components' ],
    outputStyle: details.type || "extended",
    outFile: details.output,
    sourceMap:details.output+"map", // or an absolute or relative (to outFile) path
    sourceComments:details.comments || false,
    importer: globbing,
    functions: sass_helpers({filePaths:data}),
  }, function(error, result) { // node-style callback from v3.0.0 onwards
    if (error) {
      console.error(error.status); // used to be "code" in v2x and below
      console.error(error.column);
      console.error(error.message);
      console.error(error.line);
    } else {
      postCSSHelper(result.css.toString(), details.output, details.name+".map")
      // create.file(details.output, result.css.toString());
      // create.file(details.output+".map", result.map.toString());
      // createSourceMap(result.map.toString(), dest);
      // cb()
    }
  });
}
