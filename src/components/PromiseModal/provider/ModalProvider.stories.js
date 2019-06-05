import React from 'react';
import { storiesOf } from '@storybook/react';
import PromiseModal from '../provider';

storiesOf('Address Form', module)
  .addWithJSX('with default modal', () => (
    <PromiseModal />
  ));
