'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var PropTypes = require('prop-types');
var CompassPluginActions = require('../actions');
var ToggleButton = require('./toggle-button');

// const debug = require('debug')('mongodb-compass:compass-plugin');

var CompassPluginComponent = function (_React$Component) {
  _inherits(CompassPluginComponent, _React$Component);

  function CompassPluginComponent() {
    _classCallCheck(this, CompassPluginComponent);

    return _possibleConstructorReturn(this, (CompassPluginComponent.__proto__ || Object.getPrototypeOf(CompassPluginComponent)).apply(this, arguments));
  }

  _createClass(CompassPluginComponent, [{
    key: 'handleExport',
    value: function handleExport() {
      CompassPluginActions.exportButtonClicked();
    }
  }, {
    key: 'handleImport',
    value: function handleImport() {
      CompassPluginActions.importButtonClicked();
    }

    /**
     * Render CompassPlugin component.
     *
     * @returns {React.Component} The rendered component.
     */

  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'compass-plugin' },
        React.createElement(
          ToggleButton,
          { onClick: this.handleExport },
          'Export to csv'
        ),
        React.createElement('br', null),
        ' ',
        React.createElement('br', null),
        React.createElement(
          ToggleButton,
          { onClick: this.handleImport },
          'Import csv'
        )
      );
    }
  }]);

  return CompassPluginComponent;
}(React.Component);

CompassPluginComponent.propTypes = {
  status: PropTypes.oneOf(['enabled', 'disabled'])
};

CompassPluginComponent.defaultProps = {
  status: 'enabled'
};

CompassPluginComponent.displayName = 'CompassPluginComponent';

module.exports = CompassPluginComponent;