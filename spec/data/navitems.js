const _ = require("lodash");



var primery =  [
    {"title":"What We Do"}
  , {"title":"Our Centres"}
  , {"title":"About us", "path":"/about_us"}
  , {"title":"Facilities and activities", "path":"/facilities_and_activities"}
  , {"title":"Membership", "path":"/membership"}
  , {"title":" Wellbeing and advice", "path":"/wellbeing_and_advice"}]

var secondary = [
    {title:"In About Better"}
  , {title:"How we give"}
  , {title:"Leisure Centres"}
  , {title:"Libraries"}
  , {title:"Childrens Centres"}
  , {title:"Safety & Safeguarding"}
  , {title:"Awards"}
  , {title:"News"}
  , {title:"Events"}
  , {title:"Careers"}
  , {title:"Activities and Services"}
  , {title:"Lessons and Courses"}
  , {title:"Better Facilities"}
]

var tertiary = [{title:"Active Learning"}
, {title:"Location Finder "}
, {title:"Athvarics"}
, {title:"Basketball"}
, {title:"Employability Skills"}
, {title:"Family Activities"}
, {title:"Family Support "}
, {title:"General Health Support"}
, {title:"Football"}
, {title:"Golf"}
, {title:"Group Exercise"}
, {title:"Gym"}
, {title:"Pilates"}
, {title:"Racket Sport"}
, {title:"Swimming"}
, {title:"Tai Chi"}
, {title:"Yoga"}]


var quaternary = [{title:"Money & Debt Advice sessions"}
, {title:"Housing surgery"}
, {title:"Legal Advice session"}
, {title:"Citizens Advice Bureau"}
, {title:"Legal Advice Dropin"}
, {title:"Citizens Advice Bureau"}
, {title:"Parenting"}
, {title:"Health Visitor"}
, {title:"Physical Activity sessions"}
, {title:"CAMHS parent consultations"}
, {title:"Parent partnership service drop in"}
, {title:"Homestart family group"}
, {title:"Health Visitor Baby Group"}
, {title:"Families Information Service drop-in"}
, {title:"Antenatal Clinic"}
, {title:"Parenting skills"}
, {title:"Midwife"}
, {title:"Mums Aid"}
, {title:"Midwife sessions"}
, {title:"Mums aid post natal counselling"}
, {title:"Midwife Postnatal Clinic"}
, {title:"Breastfeeding Group"}
, {title:"Best Beginnings Midwife Clinic"}
, {title:"Groupcare"}
, {title:"Child-minding"}
, {title:"Stay and Play"}
, {title:"Toy Library"}
, {title:"Eneuresis Clinic"}
, {title:"Potty Training Advice"}
, {title:"Reading Support"}]

function processNavItem(item, level){
  if(_.has(item, "path")) return item;
  let path = item.title.replace(/\s|&/g, "-").toLowerCase();
  item.title = `${item.title} ${level}`
  item.path = "/"+path;
  return item
}

function processNavItems(items, level){
  return _.map(items, (item)=>{
    return processNavItem(item, level);
  })
}

primery    = processNavItems(primery, "");
secondary  = processNavItems(secondary, "2nd");
tertiary   = processNavItems(tertiary, "3rd");
quaternary = processNavItems(quaternary, "4th");

function addSubNav(nav, sub){
  return _.map(nav, (ni, i)=>{
    if(_.random(0, 10) > 1){
      ni.sub = _.cloneDeep(_.sample(sub, _.random(1, secondary.length)));
    }

    return ni;
  });
}

module.exports = function(level=1){
  if(level >= 3){
    tertiary = addSubNav(tertiary, quaternary);
  }

  if(level >= 2){
    secondary = addSubNav(secondary, tertiary);
  }

  return (level >= 1) ? addSubNav(primery, secondary) : primary;
}