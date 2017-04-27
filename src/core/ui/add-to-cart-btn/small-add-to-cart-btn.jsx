/* @flow */

// libs
import React from 'react';
import cx from 'classnames';

// styles
import styles from './small-add-to-cart-btn.css';

// components
import Icon from 'ui/icon';

type Props = {
  pdp?: bool,
  onClick?: Function,
  className?: string,
};

const SmallAddToCartBtn = (props: Props) => {
  const { pdp, onClick, className, ...restProps } = props;
  const classNames = cx(className, styles['add-to-cart-btn']);
  const iconWrapper = cx(className, styles['add-icon-wrapper'], {[styles.pdp]: pdp});

  return (
    <button className={classNames} onClick={onClick} {...restProps}>
      <span className={iconWrapper}>
        <Icon name="fc-dadd" styleName="add-icon" />
      </span>
    </button>
  );
};

export default SmallAddToCartBtn;
