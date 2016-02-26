
import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';

import styles from './formfield.css';

const FormField = props => {
  const {error, touched, ...rest} = props;

  const blockStyle = (error && touched) ? 'has-error' : '';

  return (
    <div {...rest} styleName={blockStyle}>
      {props.children}
      {touched && error && <div styleName="error">{error}</div>}
    </div>
  );
};

FormField.propTypes = {
  error: PropTypes.node,
  touched: PropTypes.bool,
  children: PropTypes.node,
};

export default cssModules(FormField, styles);
