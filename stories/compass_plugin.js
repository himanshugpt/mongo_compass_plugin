import React from 'react';
import { storiesOf } from '@kadira/storybook';
import CompassPluginComponent from '../src/components/compass_plugin';
import ConnectedCompassPluginComponent from '../src/components/';

storiesOf('CompassPluginComponent', module)
  .add('connected to store', () => <ConnectedCompassPluginComponent />)
  .add('enabled', () => <CompassPluginComponent status="enabled" />)
  .add('disabled', () => <CompassPluginComponent status="disabled" />);
