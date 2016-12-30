const signUpCommands = {
  signUp(name, email, password) {
    return this
      .waitForElementVisible('@nameInput')
      .setValue('@nameInput', name)
      .setValue('@emailInput', email)
      .setValue('@passwordInput', password)
      .waitForElementVisible('@loginButton')
      .click('@loginButton')
      /*.waitForElementNotVisible('@authBlock')*/
      ;
  },
};

module.exports = {
  url: `http://localhost:${3000}/?auth=SIGNUP`,
  commands: [signUpCommands],
  elements: {
    authBlock: {
      selector: '._auth_auth__auth-block',
    },
    nameInput: {
      selector: 'input[name=username]',
    },
    emailInput: {
      selector: 'input[name=email]',
    },
    passwordInput: {
      selector: 'input[name=password]',
    },
    loginButton: {
      selector: '._auth_auth__auth-block button[type=submit]',
    },
  },
};
