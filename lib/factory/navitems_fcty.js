"use strict";

var _ = require("lodash");
var CheckActive = require("../utils/check_active");

function add_id(item) {
  item.id = _.uniqueId("navitem");
  return item;
}

function checkSubs(navitems) {
  var check = false;
  _.forEach(navitems, function (ni) {
    if (_.has(ni, "sub")) {
      check = true;
      return false;
    }
  });

  return check;
}

function checkLevels(navitem) {

  if (!_.has(navitem, "sub")) return navitem.level;
  var level = 1;
  var check = false;
  _.forEach(navitem.sub, function (ni) {
    if (_.has(ni, "sub")) {
      level = 2;
      return false;
    }
  });
  // console.log(navitem.title, level)
  return level;
}

function findNavItem(navitems, id, item) {
  if (item) return item;
  if (_.isEmpty(navitems)) return null;
  return _.reduce(navitems, function (prev, curr) {
    if (curr.id === id) {
      return curr;
    }
    var sub = undefined;
    if (_.has(curr, "sub")) {
      sub = findNavItem(curr.sub, id, prev);
    }

    return _.isObject(sub) ? sub : prev;
  }, item);
}

function processItems(data, isActive) {
  var level = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  if (!data) return null;
  return _.map(data, function (ni) {
    ni = add_id(ni);
    ni.level = level;
    ni.active = isActive(ni.path);
    if (_.has(ni, "sub")) {
      ni.sub = processItems(ni.sub, isActive, level + 1);
    }
    return ni;
  });
}

function _setActive(data, id, isActive) {
  var active = false;
  data = _.map(data, function (ni) {
    ni.active = _.isNull(id) ? isActive(ni.path) : ni.id === id;
    if (ni.active) {
      active = true;
      return ni;
    }

    if (_.has(ni, "sub")) {
      var sub = _setActive(ni.sub, id, isActive);
      if (sub.active) {
        ni.sub = sub.data;
        ni.active = active = sub.active;
      }
    }

    return ni;
  });

  return { data: data, active: active };
}

module.exports = function (data) {
  var isActive = CheckActive();
  var navitems = processItems(data, isActive);

  navitems = _.map(navitems, function (ni) {
    ni.fullLevels = checkLevels(ni);
    return ni;
  });

  var obj = {
    findItem: function findItem(id) {
      return findNavItem(navitems, id);
    },
    getSub: function getSub(id) {
      var item = findNavItem(navitems, id);
      // console.log("sub", item)
      if (item && _.has(item, "sub")) return item.sub;
    },
    setActive: function setActive(id) {
      navitems = _setActive(navitems, id, isActive).data;
    },
    getRoots: function getRoots() {
      return navitems;
    },
    getLevels: function getLevels() {
      return _.find(navitems, function (ni) {
        return ni.active;
      }).fullLevels;
    },
    getLevelType: function getLevelType(id) {
      var item = findNavItem(navitems, id);
      if (item) {
        return _.has(item, "fullLevels") ? item.fullLevels : item.level;
      }

      return null;
    }
  };

  return obj;
};