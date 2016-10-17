
// libs
import _ from 'lodash';
import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import localized from 'lib/i18n';

// components
import EditableBlock from 'ui/editable-block';
import EditAddress from '../address/edit-address';
import { Form } from 'ui/forms';
import Button from 'ui/buttons';
import ViewAddress from '../address/view-address';
import ErrorAlerts from 'wings/lib/ui/alerts/error-alerts';
import RadioButton from 'ui/radiobutton/radiobutton';

import { AddressKind } from 'modules/checkout';

// styles
import styles from './address-list.css';

type Props = {
  activeAddress?: number|string,
  addresses: Array<any>,
  collapsed: boolean,
  continueAction: Function,
  editAction: Function,
  inProgress: boolean,
  isEditing: boolean,
  t: any,
};

class AddressList extends Component {
  props: Props;

  state = {
    isEditing: {},
    activeAddress: this.props.activeAddress,
  };

  @autobind
  editAddress(address) {
    this.setState({
      isEditing: address,
    });
  }

  @autobind
  finishEditingAddress(id) {
    this.props.updateAddress(id).then(() => {
      this.setState({
        isEditing: {},
      });
    });
  }

  @autobind
  saveAddress() {
    this.setState({
      isEditing: {},
    });

    this.props.continueAction(this.state.activeAddress);
  }

  @autobind
  chooseAddress(id) {
    this.setState({
      activeAddress: id,
    });
  }

  renderAddresses() {
    if (_.isEmpty(this.props.addresses)) {
      return <EditAddress {...this.props} addressKind={AddressKind.SHIPPING} />;
    }

    const items = _.map(this.props.addresses, (address, key) => {
      const content = <ViewAddress { ...address } hideName />;
      const checked = address.id === this.state.activeAddress;

      return (
        <li styleName="item">
          <RadioButton
            id={`address-radio-${key}`}
            key={`address-radio-${key}`}
            name={`address-radio-${key}`}
            checked={checked}
            onChange={() => this.chooseAddress(address.id)}
          >
            <EditableBlock
              isEditing={!_.isEmpty(this.state.isEditing)}
              styleName="item-content"
              title={address.name}
              content={content}
              editAction={() => this.editAddress(address)}
            />
          </RadioButton>
        </li>
      );
    });

    return (
      <ul styleName="list">{items}</ul>
    );
  }

  @autobind
  calcelEditing() {
    this.setState({
      isEditing: {},
    });
  }

  renderEditingForm(address) {

    return (
      <Form onSubmit={() => this.finishEditingAddress(address.id)}>
        <div styleName="form-header">
          <legend styleName="legend">EDIT ADDRESS</legend>
          <span styleName="action-link" onClick={this.calcelEditing}>Cancel</span>
        </div>
        <EditAddress {...this.props} address={address} addressKind={AddressKind.SHIPPING} />

        <ErrorAlerts error={this.props.error} />
        <div styleName="button-wrap">
          <Button isLoading={this.props.inProgress} styleName="checkout-submit" type="submit">Save & Continue</Button>
        </div>
      </Form>
    );
  }

  renderList() {
    const { t } = this.props;

    return (
      <Form onSubmit={this.saveAddress}>
        <legend styleName="legend">SHIPPING ADDRESS</legend>
        {this.renderAddresses()}

        <ErrorAlerts error={this.props.error} />
        <div styleName="button-wrap">
          <Button isLoading={this.props.inProgress} styleName="checkout-submit" type="submit">{t('CONTINUE')}</Button>
        </div>
      </Form>
    );
  }

  render() {
    return !_.isEmpty(this.state.isEditing) ? this.renderEditingForm(this.state.isEditing) : this.renderList();
  }
}

export default localized(AddressList);
