
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

import { AddressKind } from 'modules/checkout';

// styles
import styles from '../checkout.css';

class AddressList extends Component {

  state = {
    isEditing: false,
  };

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
        <EditAddress {...this.props} addressKind={AddressKind.SHIPPING} />

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

  render() {
    return this.state.isEditing ? this.renderEditingForm() : this.renderList();
  }
}

export default localized(AddressList);
