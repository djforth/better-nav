const _ = require("lodash");

function parseURL(path){
  // Regex taken from is from javascript, the good parts by Douglas Crockford - Best performance (http://jsperf.com/url-parse2)
  let parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

  return path.match(parse_url);
}

function getURL() {
  //Gets Current Path
  return decodeURIComponent(window.location.href);
}

module.exports = function(){
  if(_.isUndefined(window)) return false;

  let current_path = getURL();

  let parsed_path = parseURL(current_path);

  return (path)=>{
    path = (path.match(/^\//)) ? path.replace(/^\//, "") : path;
    return _.includes(parsed_path, path);
  }
}