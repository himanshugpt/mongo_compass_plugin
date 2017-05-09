const expect = require('chai').expect;
const CompassPluginStore = require('../../lib/stores');

describe('CompassPluginStore', function() {
  beforeEach(function() {
    // reset the store to initial values
    CompassPluginStore.setState(CompassPluginStore.getInitialState());
  });

  it('should have an initial state of {status: \'enabled\'}', function() {
    expect(CompassPluginStore.state.status).to.be.equal('enabled');
  });

  describe('toggleStatus()', function() {
    it('should switch the state to {status: \'disabled\'}', function() {
      CompassPluginStore.toggleStatus();
      expect(CompassPluginStore.state.status).to.be.equal('disabled');
    });

    it('should switch the state back to {status: \'enabled\'} when used a second time', function() {
      CompassPluginStore.toggleStatus();
      CompassPluginStore.toggleStatus();
      expect(CompassPluginStore.state.status).to.be.equal('enabled');
    });
  });
});
