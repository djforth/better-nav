//Libraries
const React    = require("react")
    , ReactDOM = require('react-dom')
    , _        = require("lodash");


let mixins = require("morse-react-mixins");
const [checker, cssMixins, textMixins, widthsMixins]  = [mixins.checker, mixins.css_mixins, mixins.text_mixins, mixins.widths_mixins];

//Flux
const NavItemsActions = require("../actions/navitems_actions")
    , NavItemsStore   = require("../stores/navitems_store");


//Compenents
const Navitem = require("./nav_item");

class MobileNav extends React.Component {
  constructor(props) {
    super(props);
    this.nav = ["nav-list", "mobile-nav-list", {hidden:true}]
    this.state = {
      active:null
    , device:"mobile"
    , level: 0
    , nav_css:this.getClasses(this.nav)
    , nav_items:[]
    , previous:[]
    , roots:[]
    };
  }

  // Lifecycle
  componentWillMount(){
    this.setState({roots:NavItemsStore._getRoots()})
  }

  componentDidMount(){
    NavItemsStore.addChangeListener("fetched", this._getNavItems.bind(this));
  }

  // Morse
  _getNavItems(){
    if(checker.isMounted(this)){
       this.setState({
        roots:NavItemsStore._getRoots()
      , nav_items: []
      , secondary:[]
      , tertiary:[]
      , quaternary:[]
      });
    }

  }

  _getPrevious(){
    return this.state.previous[this.state.level];
  }

  _getVisible(){
    return (this.state.level === 0) ? this.state.roots : this.state.nav_items;

  }

  _setPrevious(level){
    let previous = this.state.previous;
    previous[level] = _.cloneDeep(this.state.active);
    return previous
  }

  // Events
  _nextLevel(id){
    // console.log(NavItemsStore.getSubs(id), id)
    // let active = NavItemsStore.getItem(id)
    this.setState({
        active    : NavItemsStore.getItem(id)
      , level     : this.state.level + 1
      , nav_items : NavItemsStore.getSubs(id)
      , previous  : this._setPrevious(this.state.level + 1)
    })
  }

  _openNav(e){
    e.preventDefault();
    this.nav = this.toggleCss(this.nav);
    this.setState({nav_css:this.getClasses(this.nav)})
  }

  _upLevel(e){
    e.preventDefault();
    let previous = this._getPrevious();
    if(previous){
      let id = previous.id
      this.setState({
          active    : previous
        , level     : this.state.level - 1
        , nav_items : NavItemsStore.getSubs(id)
      });
    } else {
      this.setState({active:null, level: this.state.level - 1});
    }
  }

  // Render functions
  _renderActive(){
    if(checker.checkOject(this.state.active)){
      return (
        <li className="current-section"><a href={this.state.active.path}>In {this.state.active.title}</a></li>
      );
    }

    return ""
  }

  _renderBack(){
    let previous = this._getPrevious();
    let title = (previous) ? previous.title : "Main Menu"
    if(this.state.level > 0){
      return (
        <li className="previous-section"><a href="#" onClick={this._upLevel.bind(this)}>Back to {title}</a></li>
      );
    }

    return ""
  }

  _renderLinks(){
    let links = this._getVisible();
    if(checker.checkArray(links)){
      return _.map(links, (ni)=>{
        return (<Navitem key={ni.id} ref={ni.id} item={ni} onClick={this._nextLevel.bind(this)} device={this.props.device} />);
      });
    }

    return "";
  }

  render(){
    return (
      <div className="nav-holder">
        <a className="open-nav" href="#" onClick={this._openNav.bind(this)}>
          <i className="icon-hamburger"></i>
          <span className="hidden">Open Nav</span></a>
        <ul className={this.state.nav_css}>
          {this._renderBack()}
          {this._renderActive()}
          {this._renderLinks()}
        </ul>
      </div>
    )
  }
}

Object.assign(MobileNav.prototype, cssMixins);
Object.assign(MobileNav.prototype, textMixins);
Object.assign(MobileNav.prototype, widthsMixins);

module.exports = MobileNav;