/* @flow */

// libs
import React from 'react';
import cx from 'classnames';

// styles
import styles from './add-to-cart-btn.css';

// components
import { Icon } from '@foxcomm/storefront-react/tpg';

type Props = {
  pdp?: bool,
  expanded?: bool,
  onClick?: Function,
  className?: string,
};

const AddToCartBtn = (props: Props) => {
  const { pdp, expanded = false, onClick, className, ...restProps } = props;
  const classNames = cx(className, styles['add-to-cart-btn'], {
    [styles.expanded]: expanded,
  });
  const iconWrapper = cx(className, styles['add-icon-wrapper'], {[styles.pdp]: pdp});
  const buttonTitle = cx(className, styles['add-btn-title'], {[styles.pdp]: pdp});

  return (
    <button className={classNames} onClick={onClick} {...restProps}>
      <span className={iconWrapper}>
        <Icon name="add" styleName="add-icon" />
      </span>
      <span className={buttonTitle}>ADD TO CART</span>
    </button>
  );
};

export default AddToCartBtn;
