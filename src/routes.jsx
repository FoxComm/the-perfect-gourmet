import React from 'react';
import _ from 'lodash';
import { Route, IndexRoute } from 'react-router';
import Site from './components/layout/site';
import StoreFront from './components/layout/storefront';
import Products from './components/catalog/products';
import Pdp from './components/catalog/pdp';
import SearchResults from './components/search-results/search-results';
import ShippingAndReturns from './components/static-pages/shipping-and-returns';
import PrivacyPolicy from './components/static-pages/privacy-policy';
import TermsOfUse from './components/static-pages/terms-of-use';

import ProfilePage from './components/profile/page';
import Profile from './components/profile/profile';
import ProfileUnit from './components/profile/profile-unit';
import EditName from './components/profile/blocks/edit-name';
import EditEmail from './components/profile/blocks/edit-email';
import ChangePassword from './components/profile/blocks/change-password';
import Order from './components/profile/blocks/order';
import AddressForm from './components/profile/blocks/address-form';

import StoresPage from './components/stores-page/stores-page';
import HomePage from './components/home/home-page';
import FAQPage from './components/static-pages/faqs-page';
import ContactUsPage from './components/static-pages/contact-us-page';
import AboutPage from './components/about/about-page';

import Checkout from './components/checkout/checkout';
import OrderPlaced from './components/checkout/04-order-placed/order-placed';

import Auth from './components/auth/auth';
import RestorePassword from './components/auth/restore-password';
import ResetPassword from './components/auth/reset-password';

import { isAuthorizedUser } from 'paragons/auth';

export default function makeRoutes(store) {
  const authMiddleware = (nextState, replace, callback) => {
    const { auth } = store.getState();
    if (_.isEmpty(auth) || !isAuthorizedUser(auth.user)) {
      replace({
        pathname: '/login',
        query: {
          redirectTo: nextState.location.pathname,
        },
      });
    }

    callback();
  };
  return (
    <Route path="/" component={Site}>
      <Route path="/checkout" component={Checkout} />
      <Route path="/login" component={Auth} />
      <Route path="/restore-password" component={RestorePassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route component={StoreFront}>
        <IndexRoute component={HomePage} />
        <Route path="/profile" component={ProfilePage} onEnter={authMiddleware}>
          <IndexRoute component={Profile} />
          <Route component={ProfileUnit}>
            <Route path="name" component={EditName} />
            <Route path="email" component={EditEmail} />
            <Route path="password" component={ChangePassword} />
            <Route path="orders/:referenceNumber" component={Order} />
            <Route path="addresses/:addressId" component={AddressForm} />
          </Route>
        </Route>
        <Route path="/shipping-and-returns" component={ShippingAndReturns} name="shipping-and-returns" />
        <Route path="/privacy-policy" component={PrivacyPolicy} name="privacy-policy" />
        <Route path="/terms-of-use" component={TermsOfUse} name="terms-of-use" />
        <Route path="/frequently-asked-questions" component={FAQPage} name="frequently-asked-questions" />
        <Route path="/stores" component={StoresPage} name="stores" />
        <Route path="/about" component={AboutPage} name="about" />
        <Route path="/contact-us" component={ContactUsPage} name="contact-us" />
        <Route path="/checkout/done" component={OrderPlaced} />
        <Route path="/products/:productSlug" component={Pdp} name="product" />
        <Route path="/gift-cards" component={Pdp} name="gift-cards" />
        <Route path="/search/:term" component={SearchResults} name="search" />
        <Route path=":categoryName" component={Products} name="category" />
      </Route>
    </Route>
  );
}
