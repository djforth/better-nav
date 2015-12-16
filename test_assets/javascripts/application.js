const _        = require("lodash")
    , React    = require("react")
    , ReactDom = require('react-dom');

const data = require("../../spec/data/navitems");

var navitems = data(4)
console.log(navitems)

const MainNav = require("../../src/components/main_nav");

ReactDom.render(
  <MainNav navitems={navitems} />,
  document.getElementById('primary-nav')
);

// var json = data(4)
// console.log(JSON.stringify(json));