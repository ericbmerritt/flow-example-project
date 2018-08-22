// @flow
import * as Redux from 'redux';
import * as BaseStore from '../base-store';
import * as BaseActions from '../base-actions';
import * as Signup from './signup';

export const rootReducer = (
  state: BaseStore.AppT = BaseStore.emptyApp,
  action: BaseActions.ActionT<*>
): BaseStore.AppT => {
  switch (action.type) {
    case BaseActions.SIGNUP:
      return Object.assign(
        {},
        { signup: Signup.handler(state.signup, action.payload) },
        state
      );
    default:
      return state;
  }
};
