// @flow

import * as Redux from 'redux';

import createHistory from 'history/createBrowserHistory';
import * as Reducers from './reducers/index';
import * as BaseStore from './base-store';
import * as Router from './router';

export const init = (
  routes: Router.RoutesT,
  aliases: Router.AliasesT
): Redux.Store => {
  const initialRouterState = Router.init(routes, aliases);
  const routerReducer = Router.reducer(initialRouterState);

  const store = Redux.createStore(
    Redux.combineReducers({
      app: Reducers.rootReducer,
      location: routerReducer
    })
  );

  Router.setupRouterListener(store);
  return store;
};
