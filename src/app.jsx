import React from 'react';
import I18nProvider from 'lib/i18n/provider';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@foxcomm/storefront-react/tpg';
import * as themeOverrides from './theme/context';

type Props = {
  language: string,
  translation: mixed,
  store: mixed,
}

const App = (props: Props) => {
  return (
    <I18nProvider locale={props.language} translation={props.translation}>
      <Provider store={props.store} key="provider">
        <ThemeProvider context={themeOverrides}>
          {props.children}
        </ThemeProvider>
      </Provider>
    </I18nProvider>
  );
};

export default App;
