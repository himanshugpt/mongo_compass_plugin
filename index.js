const CompassPluginComponent = require('./lib/components');
const CompassPluginActions = require('./lib/actions');
const CompassPluginStore = require('./lib/stores');

/**
 * A sample role for the component.
 */
const ROLE = {
  name: 'CompassPlugin',
  component: CompassPluginComponent
};

/**
 * Activate all the components in the Compass Plugin package.
 */
function activate() {
  // Register the CompassPluginComponent as a role in Compass
  //
  // Available roles are:
  //   - Instance.Tab
  //   - Database.Tab
  //   - Collection.Tab
  //   - CollectionHUD.Item
  //   - Header.Item

  global.hadronApp.appRegistry.registerRole('CollectionHUD.Item', ROLE);
  global.hadronApp.appRegistry.registerAction('CompassPlugin.Actions', CompassPluginActions);
  global.hadronApp.appRegistry.registerStore('CompassPlugin.Store', CompassPluginStore);
}

/**
 * Deactivate all the components in the Compass Plugin package.
 */
function deactivate() {
  global.hadronApp.appRegistry.deregisterRole('CollectionHUD.Item', ROLE);
  global.hadronApp.appRegistry.deregisterAction('CompassPlugin.Actions');
  global.hadronApp.appRegistry.deregisterStore('CompassPlugin.Store');
}

module.exports = CompassPluginComponent;
module.exports.activate = activate;
module.exports.deactivate = deactivate;
