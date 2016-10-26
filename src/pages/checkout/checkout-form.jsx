
// libs
import React, { Component } from 'react';

// styles
import styles from './header.css';

// components
import { Form } from 'ui/forms';
import Button from 'ui/buttons';
import ErrorAlerts from 'wings/lib/ui/alerts/error-alerts';

type Props = {
  title: string,
  error: Array<any>,
  submit: Function,
  action: Function,
};

class CheckoutForm extends Component {
  props: Props;

  get actionLink() {
    if (this.props.action) {
      return (
        <span styleName="action-link" onClick={this.props.action.action}>
          {this.props.action.title}
        </span>
      );
    }
  }

  render() {
    return (
      <Form onSubmit={this.props.submit}>
        <div styleName="form-header">
          <legend styleName="legend">{this.props.title}</legend>
          {this.actionLink}
        </div>

        {this.props.children}

        <ErrorAlerts error={this.state.error} />
        <div styleName="button-wrap">
          <Button isLoading={this.props.inProgress} styleName="checkout-submit" type="submit">Save & Continue</Button>
        </div>
      </Form>
    );
  }
}

export default CheckoutForm;
