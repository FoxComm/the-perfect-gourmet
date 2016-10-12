
// libs
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import localized from 'lib/i18n';

// components
import EditableBlock from 'ui/editable-block';
import { Form } from 'ui/forms';
import ViewAddress from '../address/view-address';
import AddressList from './address-list';

// styles
import styles from '../checkout.css';

// actions
import { fetchAddresses } from 'modules/checkout';

// types
import type { CheckoutBlockProps } from '../types';

class Shipping extends Component {
  props: CheckoutBlockProps;

  state = {
    isEditing: false,
  };

  componentWillMount() {
    this.props.fetchAddresses();
  }

  @autobind
  editAddress() {
    this.setState({isEditing: true})
  }

  content() {
    const savedAddress = _.find(this.props.addresses, (adr) => adr.isDefault === true);
    if (savedAddress && !this.state.isEditing) return <ViewAddress { ...savedAddress } />;

    return (
      <AddressList { ...this.props }/>
    );
  }

  render() {

    const { t } = this.props;

    return (
      <EditableBlock
        isEditing={this.state.isEditing}
        styleName="checkout-block"
        title={t('SHIPPING')}
        content={this.content()}
        editAction={this.editAddress}
      />
    );
  }
}

export default localized(Shipping);
