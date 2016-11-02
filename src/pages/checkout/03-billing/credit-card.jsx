// libs
import React from 'react';

// components
import Radiobutton from 'ui/radiobutton/radiobutton';
import ViewBilling from './view-billing';

// styles
import styles from './credit-card.css';

type CreditCardType = {
  id: number,
  brand: string,
  lastFour: string,
  expMonth: number,
  expYear: number,
};

type Props = {
  creditCard: CreditCardType,
  selected: boolean,
  onSelect: (cc: CreditCardType) => void,
};

const CreditCard = (props: Props) => {
  const { creditCard, selected, onSelect, editCard } = props;
  const { id } = creditCard;

  return (
    <div key={id} styleName="credit-card">
      <Radiobutton
        name="credit-card"
        checked={selected}
        onChange={() => onSelect(creditCard)}
        id={`credit-card-${id}`}
      >
        <ViewBilling billingData={creditCard} />
      </Radiobutton>
      <div styleName="actions">
        <span styleName="action" onClick={() => editCard(creditCard)}>Edit</span>
        <span styleName="action">Delete</span>
      </div>
    </div>
  );
};

export default CreditCard;
