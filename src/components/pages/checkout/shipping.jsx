
/* @flow */

import React, { Component } from 'react';
import cssModules from 'react-css-modules';
import styles from './checkout.css';
import { reduxForm } from 'redux-form';

import Button from '../../common/buttons';
import { TextInput } from '../../common/inputs';
import EditableBlock from '../../editable-block';
import { FormField } from '../../forms';

type ShippingProps = {
  isEditing: boolean;
  editAction: () => any;
};

const ViewShipping = () => {
  return <span>view content</span>;
};

type EditShippinProps = {
  continueAction: () => any;
  handleSubmit: () => any;
  fields: Object;
}

/* ::`*/
@reduxForm({
  form: 'checkout-shipping',
  fields: ['name', 'address1', 'address2', 'country', 'zip', 'city', 'state', 'phone'],
})
@cssModules(styles)
/* ::`*/
class EditShipping extends Component {
  props: EditShippinProps;

  render() {
    const props: EditShippinProps = this.props;
    const { handleSubmit } = props;
    const { fields: {name, address1, address2, country, zip, city, state, phone}} = props;

    return (
      <form onSubmit={handleSubmit} styleName="checkout-form">
        <FormField styleName="checkout-field" {...name}>
          <TextInput placeholder="FIRST & LAST NAME" {...name} />
        </FormField>
        <FormField styleName="checkout-field" {...address1}>
          <TextInput placeholder="STREET ADDRESS 1" {...address1} />
        </FormField>
        <FormField styleName="checkout-field" {...address2}>
          <TextInput placeholder="STREET ADDRESS 2 (optional)" {...address2} />
        </FormField>
        <div styleName="union-fields">
          <FormField styleName="checkout-field" {...country}>
            <TextInput placeholder="COUNTRY" {...country} />
          </FormField>
          <FormField styleName="checkout-field" {...zip}>
            <TextInput placeholder="ZIP" {...zip} />
          </FormField>
        </div>
        <div styleName="union-fields">
          <FormField styleName="checkout-field" {...city}>
            <TextInput placeholder="CITY" {...city} />
          </FormField>
          <FormField styleName="checkout-field" {...state}>
            <TextInput placeholder="STATE" {...state} />
          </FormField>
        </div>
        <FormField styleName="checkout-field" {...phone}>
          <TextInput placeholder="PHONE" {...phone} />
        </FormField>
        <Button onClick={props.continueAction}>CONTINUE</Button>
      </form>
    );
  }
}


const Shipping = (props: ShippingProps) => {
  return (
    <EditableBlock
      title="SHIPPING"
      isEditing={props.isEditing}
      editAction={props.editAction}
      viewContent={<ViewShipping />}
      editContent={<EditShipping {...props} />}
    />
  );
};

export default cssModules(Shipping, styles);
