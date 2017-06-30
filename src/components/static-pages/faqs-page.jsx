/* @flow */

// libs
import React, { Component } from 'react';

// components
import PageTitle from '../cms/page-title';
import PageBody from '../cms/page-body';

import data from './faq-data.json';

class FAQPage extends Component {
  render() {
    return (
      <div>
        <PageTitle title="Frequently Asked Questions" />
        <PageBody blocks={data} />
      </div>
    );
  }
}

export default FAQPage;
