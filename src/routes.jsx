import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Site from './components/layout/site';
import StoreFront from './components/layout/storefront';
import Products from './pages/catalog/products';
import Pdp from './pages/catalog/pdp';
import Search from './pages/search/search';
import ShippingAndReturns from './pages/static/shipping-and-returns';
import PrivacyPolicy from './pages/static/privacy-policy';
import TermsOfUse from './pages/static/terms-of-use';
import Profile from './components/profile/profile';
import Page from './components/profile/page';
import EditProfile from './components/profile/edit-profile';
import EditName from './components/profile/blocks/edit-name';

import Checkout from './pages/checkout/checkout';
import OrderPlaced from './pages/checkout/04-order-placed/order-placed';

const routes = (
  <Route path="/" component={Site}>
    <Route path="/checkout" component={Checkout} />
    <Route component={StoreFront}>
      <IndexRoute component={Products} />
      <Route path="/profile" component={Page}>
        <IndexRoute component={Profile} />
        <Route path="/profile/edit" component={EditProfile}>
          <Route path="name" component={EditName} />
        </Route>
      </Route>
      <Route path="/shipping-and-returns" component={ShippingAndReturns} name="shipping-and-returns" />
      <Route path="/privacy-policy" component={PrivacyPolicy} name="privacy-policy" />
      <Route path="/terms-of-use" component={TermsOfUse} name="terms-of-use" />
      <Route path="/checkout/done" component={OrderPlaced} />
      <Route path="/products/:productId" component={Pdp} name="product" />
      <Route path=":categoryName(/:productType)" component={Products} name="category" />
      <Route path="/search/:term" component={Search} name="search" />
    </Route>
  </Route>
);

export default routes;
