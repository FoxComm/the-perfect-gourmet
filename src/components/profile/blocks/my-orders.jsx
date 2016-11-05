// @flow
import _ from 'lodash';
import React, { Component } from 'react';
import styles from '../profile.css';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import moment from 'moment';
import { stateTitles } from 'paragons/order';

import Block from '../common/block';
import { Link } from 'react-router';
import Currency from 'ui/currency';

import * as actions from 'modules/orders';

function mapStateToProps(state) {
  return {
    orders: _.get(state.orders, 'list.result', []),
  };
}

class MyOrders extends Component {

  componentWillMount() {
    this.props.fetchOrders();
  }

  @autobind
  renderOrder(order) {
    return (
      <tr key={order.referenceNumber}>
        <td>
          {moment(order.placedAt).format('L')}
        </td>
        <td>{order.referenceNumber}</td>
        <td>
          <Currency value={order.grandTotal} currency={order.currency} />
        </td>
        <td>
          <span>{stateTitles[order.state]}</span>
        </td>
        <td>
          TRACKING ID
        </td>
        <td>
          <Link to={`/profile/orders/${order.referenceNumber}`}>View Details</Link>
        </td>
      </tr>
    );
  }

  render() {
    const { props } = this;

    return (
      <Block title="My Orders">
        <table styleName="simple-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Order #</th>
              <th>Total</th>
              <th>Status</th>
              <th>Tracking</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {_.map(props.orders, this.renderOrder)}
          </tbody>
        </table>
      </Block>
    );
  }
}

export default connect(mapStateToProps, actions)(MyOrders);
