// @flow

export type ActionTypeT = 'LOCATION_CHANGE' | 'SIGNUP';

export type ActionT<T> = {
  type: ActionTypeT,
  payload: T,
  error?: boolean
};

export const LOCATION_CHANGE = 'LOCATION_CHANGE';
export const SIGNUP = 'SIGNUP';

export const createAction = <T>(type: ActionTypeT, payload: T): ActionT<T> => {
  return { type, payload, error: false };
};
