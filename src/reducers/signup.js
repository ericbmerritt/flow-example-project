// @flow
import * as Redux from 'redux';
import produce from 'immer';
import * as BaseStore from '../base-store.js';
import * as BaseActions from '../base-actions';
import * as Maybe from '../maybe';

export const SIGNUP_EMAIL = 'SIGNUP_EMAIL';
export const SIGNUP_PASSWORD = 'SIGNUP_PASSWORD';
export const SIGNUP_PASSWORD_CONFIRM = 'SIGNUP_PASSWORD_CONFIRM';
export const SIGNUP_SUBMIT = 'SIGNUP_SUBMIT';

export type PayloadTypeT =
  | 'SIGNUP_EMAIL'
  | 'SIGNUP_PASSWORD'
  | 'SIGNUP_PASSWORD_CONFIRM'
  | 'SIGNUP_SUBMIT';

export type PayloadT = {
  type: PayloadTypeT,
  value: Maybe.T<string>
};

export const emailChange = (email: string): BaseActions.ActionT<PayloadT> =>
  BaseActions.createAction(BaseActions.SIGNUP, {
    type: SIGNUP_EMAIL,
    value: Maybe.just(email)
  });

export const passwordChange = (
  password: string
): BaseActions.ActionT<PayloadT> =>
  BaseActions.createAction(BaseActions.SIGNUP, {
    type: SIGNUP_PASSWORD,
    value: Maybe.just(password)
  });

export const passwordConfirmChange = (
  passwordConfirm: string
): BaseActions.ActionT<PayloadT> =>
  BaseActions.createAction(BaseActions.SIGNUP, {
    type: SIGNUP_PASSWORD_CONFIRM,
    value: Maybe.just(passwordConfirm)
  });

export const signup = (): BaseActions.ActionT<PayloadT> =>
  BaseActions.createAction(BaseActions.SIGNUP, {
    type: SIGNUP_SUBMIT,
    value: Maybe.nothing()
  });

const empty: BaseStore.SignupT = {
  data: {
    email: Maybe.nothing(),
    password: Maybe.nothing(),
    passwordConfirm: Maybe.nothing()
  }
};

export const signupHandler = (
  state: BaseStore.SignupT = empty
): BaseStore.SignupT => produce(state, (draft: BaseStore.SignupT) => draft);

export const passwordConfirmHandler = (
  draft: BaseStore.SignupT,
  passwordConfirm: string
): void => {
  draft.data.passwordConfirm = Maybe.maybe(passwordConfirm);
};

export const passwordHandler = (
  draft: BaseStore.SignupT,
  password: string
): void => {
  draft.data.password = Maybe.maybe(password);
};

export const emailHandler = (draft: BaseStore.SignupT, email: string): void => {
  draft.data.email = Maybe.maybe(email);
};

export const handler = (
  state: BaseStore.SignupT = empty,
  payload: PayloadT
): BaseStore.SignupT =>
  produce(state, (draft: BaseStore.SignupT) => {
    if (!draft.data) {
      draft.data = {};
    }
    console.log(JSON.stringify(draft));
    switch (payload.type) {
      case SIGNUP_EMAIL:
        emailHandler(draft, Maybe.get(payload.value));
      case SIGNUP_PASSWORD:
        passwordHandler(draft, Maybe.get(payload.value));
      case SIGNUP_PASSWORD_CONFIRM:
        passwordConfirmHandler(draft, Maybe.get(payload.value));
      case SIGNUP_SUBMIT:
        console.log('submitted');
    }
    console.log(JSON.stringify(draft));
  });
