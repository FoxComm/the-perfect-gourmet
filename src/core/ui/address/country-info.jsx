
import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from 'modules/countries';


class CountryInfo extends Component {

  componentWillMount() {
    this.props.loadCountry(this.props.countryId);
  }

  get country() {
    return this.props.countries && this.props.countries[this.props.countryId];
  }

  render() {
    if (this.country) {
      return <div>{ this.props.display(this.country) } </div>;
    }
    return <div></div>;
  }
}

export default connect(state => state, actions)(CountryInfo);
