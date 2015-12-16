var fs = require("fs");
var _  = require("lodash");

// const imagePaths;

var getImages = function(data){
  let regex  = new RegExp(/^images\//);
  let images = [];

  _.forIn(data, function(v, k){
    if(k.match(regex)){
      let orignal = k.replace(regex, "");
      let file = v.replace(regex, "")
      images.push({orignal:orignal, file:file})
    }
  });

  return images
}

module.exports = function(done, path){
  path = path || "public/assets/rev-manifest.json";
  fs.readFile(path, function(err, data){
    if(err)
      done(err, null);
    else {
      let d = JSON.parse(data.toString());
      let imagePaths = getImages(d);
      done(null, imagePaths);
    }
  });
}
