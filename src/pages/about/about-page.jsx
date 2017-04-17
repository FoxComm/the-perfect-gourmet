/* @flow */

// libs
import React from 'react';
import { Link } from 'react-router';
import scrollTo from 'lib/scroll-to';
import { autobind } from 'core-decorators';
import { assetsUrl } from 'lib/env';

// styles
import styles from './about-page.css';

// components
import IntroSLider from './intro-slider';
import MentionBlock from './mention-block';
import CookingBlock from './cooking-block';

import mentions from './mentions';

const headerOffset = 86;

const mentionBlocks = mentions.map((mention, i) =>
  <div styleName="mention-wrap" key={i}>
    <MentionBlock
      urlPrefix={assetsUrl(`/images/about-page`)}
      mention={mention}
    />
  </div>
);

export default class AboutPage extends React.Component {

  @autobind
  scrollToIntroBlock() {
    scrollTo(this.refs.introBlock, 1000, headerOffset);
  }

  render() {
    return (
      <div>
        <div styleName="top-header-wrap">
          <div styleName="logo-white" />
          <div styleName="text-wrap">
            <h1 styleName="title">CHEF CRAFTED MEALS DELIVERED TO YOUR DOOR</h1>
          </div>
          <div styleName="scroll-arrow" onClick={this.scrollToIntroBlock} />
        </div>

        <div styleName="intro-block" ref="introBlock">
          <div styleName="content-wrapper">
            <div styleName="intro-title">THE PERFECT GOURMET IS PERFECT FOR</div>
            <IntroSLider />
            <div styleName="intro-text">
              
              <p><b>What Makes Us Different?</b></p>
              
              <p>Dinner should be an enjoyable end to your busy day, not another
                reason to stress. Meal kit delivery services are appealing,
                but as you may already know, there's a lot of work that stands
                between you and your meal.</p>

              <p>What if you could enjoy delicious, quality dinners without having
                to prep, cook, or clean?</p>

              <p>That’s where The Perfect Gourmet comes in. For over ten years, we’ve
                been crafting fabulous food, and delivering to over 200,000 households
                a year. Each dish--whether it’s Osso Buco, Thai Chicken, Indian Flatbread,
                or anything else that you choose --begins with a great recipe and the
                right ingredients. Your food is prepared, flash-frozen, and delivered
                to your door.</p>
  
              <p>Yes, we know what you’re thinking: “<i>Frozen</i> food?”</p>

              <p>Don’t let other frozen foods give you any misconceptions about ours. We
                use this process to lock in food’s flavors and nutrients, making it taste
                as if you just spent hours prepping in the kitchen, as well as let you
                enjoy foods and ingredients that aren’t in season whenever you want. They’re
                specially designed to cook <i>from</i> frozen--no thawing required-- so that your
                food will be ready for you when you want it, and most can be kept in the
                freezer for up to a year.</p>
              
              <p>Waste will be a thing of the past.</p>
              
              <p>So what are you waiting for? Discover how stress-free dinner can be, and let
                us show you why <b>frozen</b> is the new <b>fresh</b>.</p>
            </div>

            <Link to="/best-sellers" styleName="action-link">
              Shop Best Sellers
            </Link>
          </div>
        </div>

        <CookingBlock />

        <div styleName="fresh-header-wrap">
          <div styleName="content-wrapper">
            <div styleName="text-wrap">
              <div styleName="fresh-description">QUALITY IS OUR TOP PRIORITY</div>
              <h1 styleName="title">LET US SHOW YOU WHY FROZEN IS THE NEW FRESH</h1>
            </div>
          </div>
        </div>

        <div styleName="mentions">
          <div styleName="mentions-header-wrap">
            <div styleName="mentions-text-wrap">
              <div styleName="mentions-description">OUR CUSTOMERS ARE SHARING THE LOVE</div>
              <h1 styleName="mentions-title">WHAT PEOPLE ARE SAYING</h1>
            </div>
          </div>
          <div styleName="mention-blocks">
            {mentionBlocks}
          </div>
        </div>

        <div styleName="gifts-block">
          <div styleName="gifts-header-wrap">
            <div styleName="gifts-wrap">
              <div styleName="gifts-description">THE PERFECT GOURMET</div>
              <h1 styleName="gifts-title">MAKES THE PERFECT GIFT</h1>
              <div styleName="gifts-text">
                Give the gift of delicious food for any occasion
                with The Perfect Gourmet digital gift cards.
              </div>
              <Link to="/gift-cards" styleName="shop-gift-cards-link">
                Shop gift cards
              </Link>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
