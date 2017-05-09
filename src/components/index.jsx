const React = require('react');
const { StoreConnector } = require('hadron-react-components');
const CompassPluginComponent = require('./compass_plugin');
const Store = require('../stores');
const Actions = require('../actions');

// const debug = require('debug')('mongodb-compass:compass-plugin:index');

class ConnectedCompassPluginComponent extends React.Component {
  /**
   * Connect CompassPluginComponent to store and render.
   *
   * @returns {React.Component} The rendered component.
   */
  render() {
    return (
      <StoreConnector store={Store}>
        <CompassPluginComponent actions={Actions} {...this.props} />
      </StoreConnector>
    );
  }
}

ConnectedCompassPluginComponent.displayName = 'ConnectedCompassPluginComponent';

module.exports = ConnectedCompassPluginComponent;
