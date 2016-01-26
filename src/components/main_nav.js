//Libraries
const React    = require("react")
    , ReactDOM = require('react-dom')
    , _        = require("lodash");

// Morse Libraies
const ViewportDetect = require("viewport-detection-es6");

// const checker = require("../utils/checker");

let mixins = require("morse-react-mixins");
const [checker, cssMixins, textMixins, widthsMixins]  = [mixins.checker, mixins.css_mixins, mixins.text_mixins, mixins.widths_mixins];

//Flux
const NavItemsActions = require("../actions/navitems_actions")
    , NavItemsStore   = require("../stores/navitems_store");

//Compenents
const Desktop = require("./desktop_nav")
    , Mobile  = require("./mobile_nav");


class MainNav extends React.Component {
  constructor(props) {
    super(props);
    NavItemsActions.prerenderItem(this.props.navitems)
    // let root = NavItemsStore._getRoots();
    this.state = {
      device:"mobile"
    };
  }

  //Lifecycle
  componentDidMount(){
    this.detect = new ViewportDetect();
    this.device = this.detect.getDevice();
    this.id = this.detect.trackSize(this._onDeviceChange.bind(this));

    this.setState({device:this.device})
    NavItemsStore.addChangeListener("api_set", this._fetchData.bind(this));
    NavItemsActions.setApi(this.props.navitemsApi);
  }

  componentWillUnmount() {
    this.detect.removeCallback(this.id);
    NavItemsStore.removeChangeListener("fetched", this._getNavItems);
    NavItemsStore.removeChangeListener("api_set", this._fetchData);
  }

  // event handlers
  _onDeviceChange(device, size){

    if(this.state.device !== device){
      this.device = device;
      this.setState({device:this.device})
    }

    this.size   = size;
  }

  _fetchData(){

    NavItemsStore.removeChangeListener("api_set", this._fetchData);
    _.defer(()=>{
      NavItemsActions.fetchData()
    });
  }

  render(){
    if(this.state.device === "mobile"){
      return (<Mobile device={this.state.device} />)
    }

    return (<Desktop device={this.state.device} />)


  }

}

Object.assign(MainNav.prototype, cssMixins);
Object.assign(MainNav.prototype, textMixins);
Object.assign(MainNav.prototype, widthsMixins);

module.exports = MainNav;