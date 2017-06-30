/* @flow */

// libs
import React, { Component } from 'react';

// components
import PageTitle from '../cms/page-title';
import PageBody from '../cms/page-body';

// data
import data from './terms-of-use-data.json';

class PrivacyPolicy extends Component {

  render() {
    return (
      <div>
        <PageTitle title="Terms of Use" />
        <PageBody blocks={data} />
      </div>
    );
  }
}

export default PrivacyPolicy;
