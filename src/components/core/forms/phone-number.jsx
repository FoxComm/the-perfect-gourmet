// @flow
import React from 'react';

function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/[^\d]/g, '');

  if (numbers.length === 10) {
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  }
  return value;
}

type Props = {
  children: string,
}

const PhoneNumber = (props: Props) => {
  return (
    <span>{formatPhoneNumber(props.children)}</span>
  );
};

export default PhoneNumber;
