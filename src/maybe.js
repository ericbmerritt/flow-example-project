/**
 * @flow
 */
export type JustT<A> = { isJust: true, value: A };
export type NothingT = { isJust: false };

export type T<A> = JustT<A> | NothingT;

export const nothing = <A>(): T<A> => Object.freeze({ isJust: false });

export const isNil = <A>(value: ?A): boolean =>
  value === null || value === undefined;

export const just = <A>(value: A): T<A> => ({
  isJust: true,
  value: value
});

export const effect = <A>(maybe: T<A>, e: A => void): T<A> => {
  if (maybe.isJust) {
    try {
      e(maybe.value);
      return maybe;
    } catch (err) {
      console.error(err, err.stack);
      return nothing();
    }
  } else {
    return maybe;
  }
};

export const filter = <A>(maybe: T<A>, p: A => boolean): T<A> => {
  if (maybe.isJust && p(maybe.value)) {
    return maybe;
  } else {
    return nothing();
  }
};

export const map = <A, B>(maybe: T<A>, f: A => B): T<B> => {
  if (maybe.isJust) {
    const result = f(maybe.value);
    if (isNil(result)) {
      return nothing();
    } else {
      return just(result);
    }
  } else {
    return maybe;
  }
};

export const flatMap = <A, B>(maybe: T<A>, f: A => T<B>): T<B> => {
  if (maybe.isJust) {
    const result = f(maybe.value);
    return isNil(result) ? nothing() : result;
  } else {
    return maybe;
  }
};

export const forEach = <A, B>(maybe: T<A>, f: A => B): void => {
  if (maybe.isJust) {
    f(maybe.value);
  }
};

export const isJust = <A>(maybe: T<A>): boolean => {
  return maybe.isJust;
};

export const isNothing = <A>(maybe: T<A>): boolean => {
  return !maybe.isJust;
};

export const get = <A>(maybe: T<A>): A => {
  if (maybe.isJust) {
    return maybe.value;
  } else {
    throw new Error('Maybe is Nothing');
  }
};

export const orElse = <A>(maybe: T<A>, alternative: T<A>): T<A> => {
  if (maybe.isJust) {
    return maybe;
  } else {
    return alternative;
  }
};

export const orJust = <A>(maybe: T<A>, value: A): A => {
  if (maybe.isJust) {
    return maybe.value;
  } else {
    return value;
  }
};

export const maybe = <A>(value: ?A): T<A> => {
  if (value === null || value === undefined) {
    return nothing();
  } else {
    return just(value);
  }
};

export const goDo = <A>(value: ?A): Do<A> => new Do(maybe(value));

export class Do<A> {
  value: T<A>;
  constructor(value: T<A>) {
    this.value = value;
  }
  map<B>(f: A => B): Do<B> {
    const result = map(this.value, f);
    return new Do(result);
  }
  flatMap<B>(f: A => T<B>): Do<B> {
    const result = flatMap(this.value, f);
    return new Do(result);
  }

  just(): A {
    return get(this.value);
  }

  filter(p: A => boolean): Do<A> {
    const result = filter(this.value, p);
    return new Do(result);
  }
  effect(e: A => void): Do<A> {
    const result = effect(this.value, e);
    return new Do(result);
  }
  expose(): T<A> {
    return this.value;
  }
  get(): A {
    return get(this.value);
  }
}
