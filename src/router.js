// @flow
import * as Redux from 'redux';
import produce from 'immer';
import uniloc from 'uniloc';
import * as BaseStore from './base-store.js';
import * as BaseActions from './base-actions';
import * as Maybe from './maybe';

export type RoutesT = { [string]: string };
export type AliasesT = { [string]: string };

export type RouterT = {
  history: any,
  uniloc: any
};

export type LocationChangePayloadT = {
  location: string
};

export const historyChange = (
  location: string
): BaseActions.ActionT<LocationChangePayloadT> => {
  return BaseActions.createAction(BaseActions.LOCATION_CHANGE, {
    location
  });
};

const parseWindowHash = (hash: string): string => {
  if (hash.startsWith('#')) {
    return hash.substr(1);
  } else {
    return hash;
  }
};

const onHashChange = (store: Redux.Store): (() => void) => {
  return (): void => {
    store.dispatch(historyChange(parseWindowHash(window.location.hash)));
  };
};

const navigationComplete = (state: BaseStore.LocationT): BaseStore.LocationT =>
  produce(state, (draft: BaseStore.LocationT) => {
    const newLocation = draft.routes.uniloc.lookup(
      parseWindowHash(window.location.hash)
    );
    const current = draft.current;
    draft.history.unshift(draft.current);
    draft.current = draft.routes.uniloc.lookup(
      parseWindowHash(window.location.hash)
    );
  });

export const reducer = (initialState: BaseStore.LocationT): Redux.reducer => {
  return (
    state: BaseStore.LocationT = initialState,
    action: BaseActions.ActionT<*>
  ): BaseStore.LocationT => {
    switch (action.type) {
      case BaseActions.LOCATION_CHANGE:
        return navigationComplete(state);
      default:
        return state;
    }
  };
};
export const init = (
  routes: RoutesT,
  aliases: AliasesT
): BaseStore.LocationT => {
  // Listen for changes to the current location.
  const parsedRoutes = uniloc(routes, aliases);
  const currentParsedRoute = parsedRoutes.lookup(
    parseWindowHash(window.location.hash)
  );

  const router = { history, uniloc: parsedRoutes };
  return { current: currentParsedRoute, history: [], routes: router };
};

export const current = (
  state: BaseStore.StoreT
): Maybe.T<BaseStore.LocationEntryT> =>
  Maybe.map(Maybe.maybe(state.location), location => location.current);

export const setupRouterListener = (store: Redux.StoreT): void => {
  window.addEventListener('hashchange', onHashChange(store), false);
};
