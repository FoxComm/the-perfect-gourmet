
// libs
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import localized from 'lib/i18n';

// components
import EditableBlock from 'ui/editable-block';
import EditAddress from '../address/edit-address';
import { Form } from 'ui/forms';
import Button from 'ui/buttons';
import ViewAddress from '../address/view-address';
import ErrorAlerts from 'wings/lib/ui/alerts/error-alerts';

// styles
import styles from '../checkout.css';

// actions
import { AddressKind, fetchAddresses } from 'modules/checkout';

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
    this.setState({
      isEditing: true,
    });
  }

  @autobind
  saveAddress() {
    this.setState({
      isEditing: false,
    });
  }

  renderAddresses() {
    const { t } = this.props;

    if (_.isEmpty(this.props.addresses)) {
      return <EditAddress {...this.props} addressKind={AddressKind.SHIPPING} />;
    }

    const items = _.map(this.props.addresses, (address, key) => {
      const content = <ViewAddress { ...address } />;

      return (
        <EditableBlock
          isEditing={this.state.isEditing}
          styleName="checkout-block"
          title={t('SHIPPING')}
          content={content}
          key={`address-${key}`}
          editAction={(adr) => this.editAddress(adr)}
        />
      );
    });

    return (
      <div>{items}</div>
    );
  }

  renderEditingForm() {
    const { t } = this.props;

    return (
      <Form onSubmit={this.saveAddress}>
        <EditAddress {...this.props} addressKind={AddressKind.SHIPPING} />;

        <ErrorAlerts error={this.props.error} />
        <Button isLoading={this.props.inProgress} styleName="checkout-submit" type="submit">{t('SAVE')}</Button>
      </Form>
    );
  }

  renderList() {
    const { t } = this.props;

    return (
      <Form onSubmit={this.props.continueAction}>
        {this.renderAddresses()}

        <ErrorAlerts error={this.props.error} />
        <Button isLoading={this.props.inProgress} styleName="checkout-submit" type="submit">{t('CONTINUE')}</Button>
      </Form>
    );
  }

  renderSavedAddress(address) {
    const { t } = this.props;

    return (
      <EditableBlock
        isEditing={false}
        styleName="checkout-block"
        title={t('SHIPPING')}
        content={<ViewAddress { ...address } />}
      />
    );
  }

  render() {
    const addressIsSet = _.find(this.props.addresses, (adr) => adr.isDefault === true);
    if (addressIsSet) return this.renderSavedAddress(addressIsSet);

    return this.state.isEditing ? this.renderEditingForm() : this.renderList();
  }
}

const mapStateToProps = state => {
  return {
    addresses: state.checkout.addresses,
  };
};

export default connect(mapStateToProps, { fetchAddresses })(localized(Shipping));
