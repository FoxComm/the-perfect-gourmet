module.exports = {
  'Cart test'(browser) {
    browser
      .url(`http://localhost:${process.env.PORT}`)
      .waitForElementVisible('body')
      .end();
  },
};
