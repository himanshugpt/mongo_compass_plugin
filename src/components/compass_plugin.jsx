const React = require('react');
const PropTypes = require('prop-types');
const CompassPluginActions = require('../actions');
const ToggleButton = require('./toggle-button');

// const debug = require('debug')('mongodb-compass:compass-plugin');

class CompassPluginComponent extends React.Component {
    	onClick(){
	    CompassPluginActions.exportButtonClicked();
        }

  /**
   * Render CompassPlugin component.
   *
   * @returns {React.Component} The rendered component.
   */
  render() {
    return (
      <div className="compass-plugin">
        <ToggleButton onClick={this.onClick} >
      		Export to csv
      	</ToggleButton>
      </div>
    );
  }
}

CompassPluginComponent.propTypes = {
  status: PropTypes.oneOf(['enabled', 'disabled'])
};

CompassPluginComponent.defaultProps = {
  status: 'enabled'
};

CompassPluginComponent.displayName = 'CompassPluginComponent';

module.exports = CompassPluginComponent;
