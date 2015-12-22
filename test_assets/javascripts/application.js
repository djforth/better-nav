require("babel-polyfill");

const _        = require("lodash")
    , React    = require("react")
    , ReactDom = require('react-dom');

const data = require("../../spec/data/navitems");

var navitems = data(1)
console.log(navitems)

const MainNav = require("../../src/components/main_nav");

ReactDom.render(
  <MainNav navitemsApi="/api/navitems.json" />,
  document.getElementById('primary-nav')
);

// var json = data(4)
// console.log(JSON.stringify(json));