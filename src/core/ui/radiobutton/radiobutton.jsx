/* @flow */

// libs
import React from 'react';

// styles
import styles from './radiobutton.css';

// types
import type { HTMLElement } from 'types';

type CheckboxProps = {
  id: string|number,
  children?: HTMLElement|string,
  className?: string,
};

const Checkbox = (props: CheckboxProps) => {
  const { children, className, ...rest } = props;
  return (
    <div className={className}>
      <input type="radio" styleName="radiobutton" {...rest} />
      <label htmlFor={props.id}>{children}</label>
    </div>
  );
};

export default Checkbox;
