import faker from 'faker';

module.exports = {
  before(client) {
    const signUpPage = client.page.signUpPage();
    const email = faker.internet.email();
    const name = faker.name.firstName();
    const password = faker.internet.password();

    signUpPage
      .navigate()
      .signUp(name, email, password);
  },

  after(client) {
    client.end();
  },

  'Cart test'(client) {
    client
      .url(`http://localhost:3000`)
      .waitForElementVisible('.icon--fc-logo')
      ;
  },
};
