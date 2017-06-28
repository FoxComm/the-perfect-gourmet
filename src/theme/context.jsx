import React, { Element } from 'react';
import ProductImage from 'components/imgix/product-image';

// types
import type { LineItem } from '@foxcomm/api-js/types/api/cord/line-items';

export function renderLineItemImage(lineItem: LineItem): Element<*> {
  return <ProductImage src={lineItem.imagePath} width={63} height={63} />
}
