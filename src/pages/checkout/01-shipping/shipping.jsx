
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

type Props = {
  addresses: Array<any>,
  collapsed: boolean,
  continueAction: Function,
  editAction: Function,
  fetchAddresses: Function,
  inProgress: boolean,
  isEditing: boolean,
  t: any,
};

class Shipping extends Component {
  props: Props;

  state = {
    isEditing: false,
  };

  componentWillMount() {
    this.props.fetchAddresses();
  }

  content() {
    const savedAddress = _.find(this.props.addresses, (adr) => adr.isDefault === true);
    if (savedAddress && !this.props.isEditing) return <ViewAddress { ...savedAddress } />;

    const activeAddress = _.get(savedAddress, 'id', '');

    return (
      <AddressList { ...this.props } activeAddress={activeAddress}/>
    );
  }

  render() {

    const { t } = this.props;

    return (
      <EditableBlock
        isEditing={this.props.isEditing}
        styleName="checkout-block"
        title={t('SHIPPING')}
        content={this.content()}
        editAction={this.props.editAction}
      />
    );
  }
}

export default localized(Shipping);
