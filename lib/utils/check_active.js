"use strict";

var _ = require("lodash");

function parseURL(path) {
  // Regex taken from is from javascript, the good parts by Douglas Crockford - Best performance (http://jsperf.com/url-parse2)
  var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

  return path.match(parse_url);
}

function getURL() {
  //Gets Current Path
  return decodeURIComponent(window.location.href);
}

module.exports = function () {
  if (_.isUndefined(window)) return false;

  var current_path = getURL();

  var parsed_path = parseURL(current_path);

  return function (path) {
    path = path.match(/^\//) ? path.replace(/^\//, "") : path;
    return _.includes(parsed_path, path);
  };
};
//# sourceMappingURL=check_active.js.map