// @flow
import * as React from 'react';
import 'grommet/scss/vanilla/index.scss';
import { render } from 'react-dom';

import * as Maybe from './maybe';

import * as Index from './views/index';
import * as Router from './router';
import * as Store from './store';

const routes: Router.RoutesT = { home: 'GET /index.html' };
const aliases: Router.AliasesT = { 'GET /': 'home' };

export const main = (): void => {
  const store = Store.init(routes, aliases);
  const renderResult = Maybe.goDo(document.getElementById('content')).effect(
    element => render(<Index.Index store={store} />, element)
  );
  const bodyResult = Maybe.goDo(document.body).effect(body =>
    body.classList.remove('loading')
  );

  if (Maybe.isNothing(renderResult.expose())) {
    console.log('content tag not present.');
  }

  if (Maybe.isNothing(bodyResult.expose())) {
    console.log('body tag not present.');
  }

  return void 0;
};

main();
