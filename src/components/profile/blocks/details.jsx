// @flow
import React, { Component } from 'react';
import profileStyles from '../profile.css';
import detailsStyles from './details.css';
import { connect } from 'react-redux';
import type { Promise as PromiseType } from 'types/promise';

import Block from '../common/block';
import Button from 'ui/buttons';

import * as actions from 'modules/profile';

const styles = {...profileStyles, ...detailsStyles};

function mapStateToProps(state) {
  return {
    account: state.profile.account,
  };
}

type Account = {
  name: string,
  email: string,
  isGuest: boolean,
  id: number,
}

type DetailsProps = {
  account: Account|{},
  fetchAccount: () => PromiseType,
}

class Details extends Component {
  props: DetailsProps;
  componentWillMount() {
    this.props.fetchAccount();
  }

  render() {
    const { account } = this.props;
    return (
      <Block title="My Details">
        <div styleName="section">
          <div styleName="line">
            <div styleName="subtitle">First and last name</div>
            <div>EDIT</div>
          </div>
          <div styleName="value">{account.name}</div>
        </div>
        <div styleName="section">
          <div styleName="line">
            <div styleName="subtitle">Email</div>
            <div>EDIT</div>
          </div>
          <div styleName="value">{account.email}</div>
        </div>
        <Button styleName="button">CHANGE PASSWORD</Button>
      </Block>
    );
  }
}

export default connect(mapStateToProps, actions)(Details);
