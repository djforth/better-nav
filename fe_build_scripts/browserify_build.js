var _        = require("lodash")
 , b_helper  = require("./javascript_helpers/browserify_builder")
 , config    = require("./config").javascript
 , es          = require('event-stream')
 , program   = require('commander');

program
  .version('0.0.1')
  .option('-m, --minify' , 'minify scripts')
  .option('-w, --watch', 'Watch scripts')
  .parse(process.argv);

reader = es.readArray(config.files)
 .pipe(es.mapSync(function(js){
    b_helper(js, program.watch, program.minify);
  }));