require("babel-polyfill");

const _        = require("lodash")
    , React    = require("react")
    , ReactDom = require('react-dom');

const data = require("../../spec/data/navitems");

// var navitems = data(1)
console.log(navitems)

// data-react-props="{"navitemsApi":"/api/shared/common/primary_navigation.json",
let navitems = [{"title":"Who we are","path":"/whatwedo","sub":[{"title":"Leisure","path":"/leisure-centres"},{"title":"Libraries","path":"/libraries"},{"title":"Children's Centres","path":"/children-centres"},{"title":"News","path":"/newsitems"},{"title":null,"path":"/title-for-careers"}]},{"title":"our locations","path":"/venues"},{"title":"What we offer","path":"/facilities-and-activities","sub":[{"title":"Facilities","path":"/facilities-and-activities/facility-types"},{"title":"Activities","path":"/facilities-and-activities/activities"},{"title":"Services","path":"/facilities-and-activities/services"},{"title":"Lessons and Courses","path":"/facilities-and-activities/lessons-and-courses"}]},{"title":"Memberships","path":"/memberships","sub":[{"title":"Pay \u0026 Play","path":"/memberships/pay-and-play-membership"},{"title":"Library Membership","path":"/memberships/library-membership"},{"title":"All Inclusive","path":"/memberships/all-inclusive-membership"},{"title":"Single Activity Membership","path":"/memberships/single-activity-membership"},{"title":"Short Term Passes","path":"/memberships/short-term-passes"}]},{"title":"Giftcards","path":"/giftcard"}]

const MainNav = require("../../src/components/main_nav");

ReactDom.render(
  <MainNav navitemsApi="/api/test.json"
  navitems={navitems} />,
  document.getElementById('primary-nav')
);

// var json = data(4)
// console.log(JSON.stringify(json));