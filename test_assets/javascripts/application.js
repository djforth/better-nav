require("babel-polyfill");

const _        = require("lodash")
    , React    = require("react")
    , ReactDom = require('react-dom');

const data = require("../../spec/data/navitems");

// var navitems = data(1)
console.log(navitems)
let navitems = [{"title":"What We Do","path":"/"},{"title":"Our Centres","path":"/"},{"title":"about_us","path":"/title-for-about_us","sub":[{"title":"A sub page level 2","path":"/title-for-about_us/"},{"title":"Another sub page","path":"/title-for-about_us/"},{"title":"Test 2","path":"/title-for-about_us/blah"}]},{"title":"facilities_and_activities","path":"/title-for-facilities_and_activities","sub":[{"title":"Extreme Interval Training ","path":"/title-for-facilities_and_activities/hiit"}]},{"title":"membership","path":"/title-for-membership"},{"title":"wellbeing_and_advice","path":"/title-for-wellbeing_and_advice","sub":[{"title":"Swim School","path":"/title-for-wellbeing_and_advice/swimschool"},{"title":"Re-Focus sessions","path":"/title-for-wellbeing_and_advice/refocus"}]}]

const MainNav = require("../../src/components/main_nav");

ReactDom.render(
  <MainNav navitemsApi="/api/test.json"
  navitems={navitems} />,
  document.getElementById('primary-nav')
);

// var json = data(4)
// console.log(JSON.stringify(json));