
// libs
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import localized from 'lib/i18n';

// components
import EditableBlock from 'ui/editable-block';
import EditAddress from './edit-address';
import { Form } from 'ui/forms';
import Button from 'ui/buttons';
import ViewAddress from './view-address';
import ErrorAlerts from 'wings/lib/ui/alerts/error-alerts';

// styles
import styles from '../checkout.css';

// actions
import { AddressKind, fetchAddresses } from 'modules/checkout';

// types
import type { CheckoutBlockProps } from '../types';

class Shipping extends Component {
  props: CheckoutBlockProps;

  componentWillMount() {
    this.props.fetchAddresses();
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
          isEditing={false}
          styleName="checkout-block"
          title={t('SHIPPING')}
          content={content}
          key={`address-${key}`}
        />
      );
    });

    return (
      <div>{items}</div>
    );
  }

  render() {
    const { t } = this.props;

    return (
      <Form onSubmit={this.props.continueAction}>
        {this.renderAddresses()}

        <ErrorAlerts error={this.props.error} />
        <Button isLoading={this.props.inProgress} styleName="checkout-submit" type="submit">{t('CONTINUE')}</Button>
      </Form>
    );
  }
}

const mapStateToProps = state => {
  return {
    addresses: state.checkout.addresses,
  };
};

export default connect(mapStateToProps, { fetchAddresses })(localized(Shipping));
