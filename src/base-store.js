// @flow
import * as Maybe from './maybe';

export type LocationEntryT = { name: string, options: Object };

export type LocationHistoryT = Array<LocationEntryT>;

export type LocationT = {
  current: LocationEntryT,
  history: LocationHistoryT,
  routes: Object
};

export type SignupFormT = {
  email: Maybe.T<string>,
  password: Maybe.T<string>,
  passwordConfirm: Maybe.T<string>
};

export type SignupT = {
  data: SignupFormT
};

export type AppT = {
  signup: SignupT
};

export type StoreT = {
  location: ?LocationT,
  app: AppT
};

export const emptySignup: SignupT = {
  data: {
    email: Maybe.nothing(),
    password: Maybe.nothing(),
    passwordConfirm: Maybe.nothing()
  }
};
export const emptyApp: AppT = { signup: emptySignup };
