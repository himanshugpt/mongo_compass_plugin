'use strict';

var Reflux = require('reflux');
var CompassPluginActions = require('../actions');
var StateMixin = require('reflux-state-mixin');
var NamespaceStore = require('hadron-reflux-store').NamespaceStore;
var debug = require('debug')('mongodb-compass:stores:compass-plugin');
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
var ObjectID = require("bson-objectid");

var dialog = require('electron').remote.dialog;

/**
 * Compass Plugin store.
 */


var CompassPluginStore = Reflux.createStore({
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
  init: function init() {},


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
  onActivated: function onActivated(appRegistry) {},


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
  onConnected: function onConnected(error, dataService) {
    this.setState({ 'dataService': dataService });
  },


  /**
   * Initialize the Compass Plugin store state. The returned object must
   * contain all keys that you might want to modify with this.setState().
   *
   * @return {Object} initial store state.
   */
  getInitialState: function getInitialState() {
    return {
      status: 'enabled',
      exportProgress: '',
      dataService: ''
    };
  },


  /**
    * handlers for import csv action defined in ../actions/index.jsx
    */
  importButtonClicked: function importButtonClicked() {
    var _this = this;

    var ns = NamespaceStore.ns;
    debug("*******************************");
    debug(NamespaceStore);
    debug(ns);
    debug("*******************************");

    dialog.showOpenDialog(function (fileNames) {
      // fileNames is an array that contains all the selected
      if (fileNames === undefined) {
        console.log("No file selected");
        return;
      }

      fs.readFile(fileNames[0], 'utf-8', function (err, data) {
        if (err) {
          alert("An error ocurred reading the file :" + err.message);
          return;
        }
        //debug(fileNames[0]);
        //debug(data);
        var dataService = _this.state.dataService;

        var lines = data.split('\n');
        //debug("lines content " + lines[0]);
        //debug("lines.length " + lines.length);
        var result = [];
        var headers = lines[0].split(",");

        for (var i = 1; i < lines.length; i++) {
          var obj = {};
          var currentline = lines[i].split(",");
          for (var j = 0; j < headers.length; j++) {
            var str = currentline[j].trim().replace(/^"|"$/g, '');
            if (headers[j] == "_id") {
              obj[headers[j]] = ObjectID(str);
            } else {
              obj[headers[j]] = str;
            }

            //debug(currentline[j]);
          }
          // console.log(obj);
          debug(obj);
          result.push(obj);
        }
        //['upsert': true],
        dataService.insertMany('census_staging.stateArea', result, function (err, data) {
          if (err) {
            alert('Error!');
            debug(err);
          } else alert('All docs inserted');
        });
      });
    });
  },


  /**
   * handlers for each action defined in ../actions/index.jsx, for example:
   */
  exportButtonClicked: function exportButtonClicked() {
    debug('buttton clicked', this.state);
    var ns = NamespaceStore.ns;
    debug(NamespaceStore);
    debug(ns);
    var dataService = this.state.dataService;

    var content = "";

    dataService.find('census.stateArea', {}, {}, function (error, documents) {
      //assert.equal(null, error);
      //for (var doc of documents) {
      //  content += JSON.stringify(doc) + "\n";
      //}

      var items = documents;
      var replacer = function replacer(key, value) {
        return value === null ? '' : value;
      }; // specify how you want to handle null values here
      var header = Object.keys(items[0]);
      var csv = items.map(function (row) {
        return header.map(function (fieldName) {
          return JSON.stringify(row[fieldName], replacer);
        }).join(',');
      });
      csv.unshift(header.join(','));
      csv = csv.join('\n');
      content = csv;
    });

    dialog.showSaveDialog(function (fileName) {
      if (fileName === undefined) {
        console.log("You didn't save the file");
        return;
      }

      // fileName is a string that contains the path and filename created in the save file dialog.  
      fs.writeFile(fileName, content, function (err) {
        if (err) {
          alert("An error ocurred creating the file " + err.message);
        }

        alert("The file has been succesfully saved");
      });
    });
  },


  /**
   * log changes to the store as debug messages.
   * @param  {Object} prevState   previous state.
   */
  storeDidUpdate: function storeDidUpdate(prevState) {
    debug('CompassPlugin store changed from', prevState, 'to', this.state);
  }
});

module.exports = CompassPluginStore;