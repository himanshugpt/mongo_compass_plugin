const Reflux = require('reflux');
const CompassPluginActions = require('../actions');
const StateMixin = require('reflux-state-mixin');
const NamespaceStore = require('hadron-reflux-store').NamespaceStore;
const debug = require('debug')('mongodb-compass:stores:compass-plugin');
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

const {dialog} = require('electron').remote

/**
 * Compass Plugin store.
 */
const CompassPluginStore = Reflux.createStore({
  /**
   * adds a state to the store, similar to React.Component's state
   * @see https://github.com/yonatanmn/Super-Simple-Flux#reflux-state-mixin
   *
   * If you call `this.setState({...})` this will cause the store to trigger
   * and push down its state as props to connected components.
   */
  mixins: [StateMixin.store],

  /**
   * listen to all actions defined in ../actions/index.jsx
   */
  listenables: CompassPluginActions,

  /**
   * Initialize everything that is not part of the store's state.
   */
  init() {
  },

  /**
   * This method is called when all plugins are activated. You can register
   * listeners to other plugins' stores here, e.g.
   *
   * appRegistry.getStore('OtherPlugin.Store').listen(this.otherStoreChanged.bind(this));
   *
   * If this plugin does not depend on other stores, you can delete the method.
   *
   * @param {Object} appRegistry   app registry containing all stores and components
   */
  onActivated(appRegistry) {
  },

  /**
   * This method is called when the data service is finished connecting. You
   * receive either an error or the connected data service object, and if the
   * connection was successful you can now make calls to the database, e.g.
   *
   * dataService.command('admin', {connectionStatus: 1}, this.handleStatus.bind(this));
   *
   * If this plugin does not need to talk to the database, you can delete this
   * method.
   *
   * @param {Object} error         the error object if connection was unsuccessful
   * @param {Object} dataService   the dataService object if connection was successful
   *
   */
  onConnected(error, dataService) {
    this.setState({'dataService': dataService});
  },

  /**
   * Initialize the Compass Plugin store state. The returned object must
   * contain all keys that you might want to modify with this.setState().
   *
   * @return {Object} initial store state.
   */
  getInitialState() {
    return {
      status: 'enabled',
      exportProgress: '',
      dataService: ''
    };
  },

/**
* handlers for import csv action defined in ../actions/index.jsx
*/
  importButtonClicked(){
    
    dialog.showOpenDialog((fileNames) => {
    // fileNames is an array that contains all the selected
    if(fileNames === undefined){
        console.log("No file selected");
        return;
    }

    //console.log(fileNames)

    fs.readFile(fileNames[0], 'utf-8', (err, data) => {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }

        let {dataService} = this.state;
        let lines = data.split("\n");
        let result = [];
        let headers = lines[0].split(",");

        for(let i=1;i<lines.length;i++){
          var obj = {};
          var currentline=lines[i].split(",");
          for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
          }
          //dataService.insert('audit.actions_tmp', obj);
          result.push(obj);
        }

        dataService.insertMany('audit.actions_tmp', 
                                result, null, 
                                (err, data) => {
                                                  alert('All docs inserted');
                                });

    });
});
 
  },

  /**
   * handlers for each action defined in ../actions/index.jsx, for example:
   */
  exportButtonClicked() {
    // this.setState({
    //   status: this.state.status === 'enabled' ? 'disabled' : 'enabled'
    // });
    debug('buttton clicked',  this.state);
    const ns = NamespaceStore.ns;
    debug(NamespaceStore);
    debug(ns);
    let {dataService} = this.state;
    let content = "";

    dataService.find('audit.actions', {}, {}, (error, documents) => {
      //assert.equal(null, error);
      //for (var doc of documents) {
      //  content += JSON.stringify(doc) + "\n";
      //}

      const items = documents
      const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
      const header = Object.keys(items[0])
      let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
      csv.unshift(header.join(','))
      csv = csv.join('\r\n')
      content = csv

    });

    dialog.showSaveDialog((fileName) => {
    if (fileName === undefined){
        console.log("You didn't save the file");
        return;
    }

    // fileName is a string that contains the path and filename created in the save file dialog.  
    fs.writeFile(fileName, content, (err) => {
        if(err){
            alert("An error ocurred creating the file "+ err.message)
        }
                    
        alert("The file has been succesfully saved");
    });
}); 


  },

  /**
   * log changes to the store as debug messages.
   * @param  {Object} prevState   previous state.
   */
  storeDidUpdate(prevState) {
    debug('CompassPlugin store changed from', prevState, 'to', this.state);
  }
});

module.exports = CompassPluginStore;
