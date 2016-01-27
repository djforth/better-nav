const _ = require("lodash")
    , DateFormatter = require("@djforth/date-formatter");

let activities = ["Gymnastics", "Group Cycling", "Acting", "Adults", "Activities for Kids", "11 15 Years", "Children's & Teens", "Gym Based", "Closed", "Martial Arts", "Lane Swimming", "Group Cycling", "Boxfit", "Games", "8 15 Years", "5 11 Years", "Low Impact", "Group Cycling", "Athletics", "Dance", "Group Exercise", "Dance", "Boxing", "Mobile Library", "Lessons", "Dance", "Gym", "Circuit", "Fitness", "Fun"];

let titles = ["Active Lifestyles (MCC)", "Adult Better Swim School", "A.H Baby", "55+ Aerobics", "Active Lifestyles Improvers Swim ", "55+ Swim and Water Workout", "Active Lifestyles Learn to Swim", "Active Lifestyles Funquatics", "Active Lifestyles Mother & Daughter (5 years +)", "60+ Swimming", "Ab-solution", "Adult & Infant/Toddler Swim School", "Active Lifestyles Aqua Natal", "80's Style Aerobics", "Active Lifestyles Aqua Discovery", "Active Lifestyles Improvers Swim", "5-a-Side Football young@heart", "Active Lifestyles Water Workout", "Active Lifestyles Splash to Swim", "15.15.15", "Active Lifestyles Learn to Swim", "20-20-20", "60+ Badminton", "ABSolution", "Ab Attack", "Ab Blast", "20.20.20", "Active Lifestyles Mother & Child (6 weeks to 8 years)", "Active Lifestyles Learn & Improvers Swim", "Active Lifestyles Aquacise"];

var locations = ["Activity Pool", "Main Pool", "Tennis Courts", "General Swim", "Astro Pitch", "Fitness Room", "Fitness Centre", "Outdoor Pool", "Water Workout", "Gym", "Dance Studio", "Sports Hall", "Main Pool", "Sauna", "Studio", "Grass Pitches", "Training Pool", "Outdoor Tennis Courts", "Group Cycle Studio", "Conference Room", "Studio", "Gymnasium", "Gym", "Studio 1", "Gym", "X-Cube ", "Main Pool ", "Leisure Pool", "Sports Hall", "Astro Pitch"];

var instructors = ["Adina", "Helen", "Sally", "Helen", "Craig", "Cecil", "Cecil", "Adina", "Cecil", "Priscila", "Priscila", "Priscila", "Priscila", "Cecil", "Young@Heart", "Young@Heart", "Young@Heart", "Kate", "Young@Heart", "Young@Heart", "Neil", "Maria", "Cecil", "Sally", "Neil", "Neil", "Sarah", "Gina Langfield", "Neil", "Sarah"]

var i = 0;

let sessions = [];

var default_session = {
    id:0
  , title:""
  , location:""
  , start:""
  , finish:""
  , instructor:""
  , places_left:0
  , description:"<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda repudiandae et eos quod error, tenetur voluptatum eaque nihil beatae sit praesentium itaque repellat quasi eius, saepe labore, iure at nisi.</p>"
  , buttons:{
    book:"http://legend.better.org.uk"
  }
}

var morning   = 9;
var afternoon = 12;
var evening   = 18;

function timeManager(date){
  var mins  = date.getMinutes();
  var hours = date.getHours();

  return function(){
    mins += 15;
    if(mins > 60){
      mins = 15;
      hours++;
    }

    return [hours, mins];
  }
}

function addSessions(filter){

  // var sessions  = []

  function createSession(date){
    let session = _.cloneDeep(default_session)
    session.id         = _.uniqueId()
    session.session    = _.sample(titles)
    session.location   = _.sample(locations)
    session.instructor = _.sample(instructors)
    session.activity   = _.sample(activities)
    let d   = _.clone(date)
    let fmt = new DateFormatter(d);
    session.start      = fmt.formatDate("%Y-%m-%d %H:%M");
    d.setHours(d.getHours()+1);
    fmt = new DateFormatter(d);
    session.finish     = fmt.formatDate("%Y-%m-%d %H:%M");
    let p = _.random(0, 20);
    if(p%4 === 0){
      session.places_left = 0;
      session.buttons.book = "";
    } else {
      session.places_left = _.random(0, 20);
    }

    if(filter){
      session.filters = filter;
    }
    // console.log(session)
    return session;
  }



  return function(st, n){
    let date = _.clone(st);

    var i = 0;
    var increment = timeManager(date);
    var sessions  = []

    do {
      let time = increment()
      date.setHours(time[0], time[1]);
      sessions.push(createSession(date));

      i++;
    } while(i <= n)
    return sessions;
  }



}


module.exports = function(days=1, date, filter){
  date = (_.isDate(date)) ? date : new Date(2015, 11, 1)
  date.setHours(9, 0, 0)
  var sessions = []
  var i = 0;
  do{
    _.forEach([9, 12, 18], (n)=>{
      date.setDate(date.getDate()+i);
      date.setHours(n)
      let creator = _.partial(addSessions(filter), date);
      let ses = creator(_.random(10, 20), filter)
      sessions = sessions.concat(ses);
    })
    i++;
  } while(i < days);


  return sessions

}


// console.log(sessions)