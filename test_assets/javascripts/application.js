require("babel-polyfill");

const _        = require("lodash")
    , React    = require("react")
    , ReactDom = require('react-dom');

const data = require("../../spec/data/navitems");

// var navitems = data(1)
// console.log(navitems)

// data-react-props="{"navitemsApi":"/api/shared/common/primary_navigation.json",
let navitems = [{"title":"Who we are","path":"/whatwedo","sub":[{"title":"Leisure","path":"/leisure-centres"},{"title":"Libraries","path":"/libraries"},{"title":"Children's Centres","path":"/children-centres"},{"title":"News","path":"/newsitems"},{"title":null,"path":"/title-for-careers"}]},{"title":"our locations","path":"/venues"},{"title":"What we offer","path":"/facilities-and-activities","sub":[{"title":"Facilities","path":"/facilities-and-activities/facility-types"},{"title":"Activities","path":"/facilities-and-activities/activities"},{"title":"Services","path":"/facilities-and-activities/services"},{"title":"Lessons and Courses","path":"/facilities-and-activities/lessons-and-courses"}]},{"title":"Memberships","path":"/memberships","sub":[{"title":"Pay \u0026 Play","path":"/memberships/pay-and-play-membership"},{"title":"Library Membership","path":"/memberships/library-membership"},{"title":"All Inclusive","path":"/memberships/all-inclusive-membership"},{"title":"Single Activity Membership","path":"/memberships/single-activity-membership"},{"title":"Short Term Passes","path":"/memberships/short-term-passes"}]},{"title":"Giftcards","path":"/giftcard"}]

const MainNav = require("../../src/components/main_nav");

ReactDom.render(
  <MainNav navitemsApi="/api/test.json"
  navitems={[]} />,
  document.getElementById('primary-nav')
);

const Touch = require("touch-nav")



var test = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem quae sint iste, eius molestias. Laboriosam architecto eaque, similique, ut tempora, commodi id veniam delectus temporibus blanditiis quas inventore. Nisi, commodi."


function createConfigs(){
  let config = []
  let config2 = []
  var i = 1;
  do{
    let num = _.random(0,i)
    let name = test.substring(num, num+10)
    let nav ={name:name, title:`Click here to go to Nav item ${i}`}
    if(i%2 === 0){
      nav.data = {id:i, additonal:`foo${i}`}
    } else {
      nav.href = "#"
    }

    nav.active = (i===1)
    config.push(nav);
    config2.push({name:`NavItem ${_.random(1, 100)}`, title:`Click here to go to Nav item ${_.random()}`, href:"http://better.org.uk"})
    i++;
  } while(i < _.random(6,12));
  // console.log(config, config2)
  return {one:config, two:config2};
}

function addNavs(){
  let config = createConfigs();
  console.log("add", config)
  // ReactDom.render(
  //   <Touch navitems={config.one} callback={callback} />,
  //   document.getElementById('nav')
  // );

  ReactDom.render(
    <Touch navitems={[_.first(config.two)]} callback={callback} />,
    document.getElementById('nav2')
  );
}


function callback(name, data){
  console.log("%j has been click", name);
  console.log(data);
}

addNavs();

const WeeklyProg = require("weekly-prog")

function createColumns(){
  let columns = [{key:"id"}]
  let additional = _.partial(addColumn, {show:true});
  let mobile     = _.partial(addColumn, {desktop:true, mobile:true, tablet:true, show:true});
  let tablet     = _.partial(addColumn, {desktop:true, mobile:false, tablet:true, show:true});
  let desktop    = _.partial(addColumn, {desktop:true, mobile:false, tablet:false, show:true});

  function addColumn(defaults, keys){
    return _.map(keys, (k)=>{
      // console.log(k)
      k = (_.isString(k)) ? {key:k} : k;
      return _.defaults(k, defaults);
    });
  }

  let obj

  obj = {
    additional:(keys)=>{
      columns = columns.concat(additional(keys));
      return obj;
    }
    , addMobile:(keys)=>{
      columns = columns.concat(mobile(keys));
      return obj;
    }
    , addTablet:(keys)=>{
      columns = columns.concat(tablet(keys));
      return obj;
    }

    , addDesktop:(keys)=>{
      columns = columns.concat(desktop(keys));
      return obj;
    }

    , value:()=>columns
  }

  return obj;
}

// rubocop:disable all

//rubocop:enable all
let cols = createColumns()
           .addMobile([
            {
               key:"start"
             , title:"time"
             , concat:"finish"
             , split:"- "
             , wrapper:"pill pill-secondary"
             , type:"time"
             , fmt:"%H:%M"
            }
          , {key:"session", wrapper:"bold-weight em"}
          , {key:"expand", title:""}
            ])
           .addTablet(["location"])
           .addDesktop(["instructor", "activity", {key:"places_left", wrapper:"places"}])
           .addTablet([{key:"actions", title:""}])
           .additional(["description"]).value()

let css = {
  default     : "col-lg-2 col-md-3 col-sm-5"
, places_left : "col-lg-1"
, activity    : "col-lg-1"
, start       : "col-lg-2 col-md-3 col-sm-4"
, session     : "col-lg-2 col-md-3 col-sm-6"
, expand      : "col-lg-1 col-md-2 col-sm-2 expander"
, actions     : "col-lg-1 col-md-1 col-sm-3"
}

let timeperiod = [
    {title:"Morning"  , time:{st:0, fn:11}}
  , {title:"Afternoon", time:{st:12, fn:17}}
  , {title:"Evening"  , time:{st:18, fn:23}}
]

let sessions = require("./sessions.js")


console.log(sessions(1, new Date()))

// ReactDom.render(
//   <WeeklyProg
//     columns     = {cols}
//     css         = {css}
//     groupby     = "start"
//     print       = "/timetable/print/:date.pdf"
//     sessions    = {sessions(1, new Date())}
//     sessionsApi = "/api/timetable.json"
//     timeperiod  = {timeperiod}
//   />,
//   document.getElementById('weekly-prog')
// );