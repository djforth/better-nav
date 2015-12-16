var _        = require("lodash")
 , b_helper  = require("../javascript_helpers/browserify_builder")
 , bs        = require("./bs_helper")
 , config    = require("../config").javascript
 , es        = require("event-stream")
 , folder    = require("../utils/folder_helpers")
 , fs        = require("fs");

module.exports = function(){
  // b_helper(config.files, true, true, bs());
  reader = es.readArray(config.files)
   .pipe(es.mapSync(function(js){
      b_helper(js, true, true, bs());
    }));
}
