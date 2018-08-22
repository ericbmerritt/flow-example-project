/**
 * @flow
 */
import * as Maybe from '../src/maybe';

test('isNil tests', () => {
  expect(Maybe.isNil(1)).toBe(false);
  expect(Maybe.isNil(undefined)).toBe(true);
  expect(Maybe.isNil(null)).toBe(true);
});

test('valid values', () => {
  const x: Maybe.T<*> = Maybe.maybe(1);
  expect(Maybe.isJust(x)).toBe(true);
  expect(Maybe.isNothing(x)).toBe(false);
  const y = Maybe.maybe(0);
  expect(Maybe.isJust(y)).toBe(true);
  expect(Maybe.isNothing(y)).toBe(false);
  const z = Maybe.maybe({});
  expect(Maybe.isJust(z)).toBe(true);
  expect(Maybe.isNothing(z)).toBe(false);
});

test('empty values', () => {
  const x = Maybe.maybe(null);
  expect(Maybe.isNothing(x)).toBe(true);
  expect(Maybe.isJust(x)).toBe(false);
  const y = Maybe.maybe(undefined);
  expect(Maybe.isNothing(y)).toBe(true);
  expect(Maybe.isJust(y)).toBe(false);
});

test('extract value with just()', () => {
  const m = Maybe.maybe('some value');
  expect(Maybe.get(m)).toBe('some value');
});

test('get() should throw on an empty value', () => {
  const n = Maybe.maybe(null);
  expect(() => Maybe.get(n)).toThrow();
});

test('orJust', () => {
  const x = Maybe.maybe(null);
  const orValue = Maybe.orJust(x, 'hi');
  expect(orValue).toBe('hi');
  const y = Maybe.maybe('hello');
  expect(Maybe.orJust(y)).toBe('hello');
});

test('map value', () => {
  const x = Maybe.maybe('bob');
  const result = Maybe.map(x, v => v.toUpperCase());
  expect(result).toEqual(Maybe.maybe('BOB'));
  const value = Maybe.get(result);
  expect(value).toBe('BOB');
});

test('map empty value is noop', () => {
  const n = Maybe.maybe(null);
  const result = Maybe.map(n, v => v.toUpperCase());
  expect(result).toEqual(Maybe.nothing());
});

test('chaining', () => {
  const b = Maybe.goDo('MaybeT  ')
    .map(v => v.trim())
    .map(v => v.toUpperCase())
    .get();
  expect(b).toBe('MAYBET');
});

test('flatMap', () => {
  const a = Maybe.maybe('hi');
  const result = Maybe.flatMap(
    a,
    (v: string): Maybe.T<string> => {
      if (v === 'hi') {
        return Maybe.just('world');
      } else {
        return Maybe.nothing;
      }
    }
  );
  expect(result).toEqual(Maybe.just('world'));
});

test('get() throws on empty values', () => {
  // $FlowExpectedError
  const fNull = () => Maybe.get(null);
  expect(fNull).toThrow();
  // $FlowExpectedError
  const fUndefined = () => Maybe.get(undefined);
  expect(fUndefined).toThrow();
});

test('filter() to return just', () => {
  const upper = Maybe.goDo('alex  ')
    .map(v => v.trim())
    .filter(v => v.length !== 0)
    .map(v => v.toUpperCase())
    .get();
  expect(upper).toEqual('ALEX');
});

test('filter() to return nothing', () => {
  const upper = Maybe.goDo('  ')
    .map(v => v.trim())
    .filter(v => v.length !== 0)
    .map(v => v.toUpperCase())
    .expose();
  expect(upper).toEqual(Maybe.nothing());
});

test('forEach() to side effect with value', () => {
  let effect;
  const result = Maybe.forEach(Maybe.maybe('effect'), v => (effect = v)); // eslint-disable-line no-return-assign
  expect(effect).toBe('effect');
  expect(result).toBeUndefined();
});

test('forEach() to not side effect with empty value', () => {
  let effect;
  const result = Maybe.forEach(Maybe.maybe(null), v => (effect = v)); // eslint-disable-line no-return-assign
  expect(effect).toBeUndefined();
  expect(result).toBeUndefined();
});

test('orElse', () => {
  const x = Maybe.maybe(null);
  expect(Maybe.orElse(x, Maybe.maybe('hi'))).toEqual(Maybe.just('hi'));
  const y = Maybe.maybe('hello');
  expect(Maybe.orElse(y, Maybe.maybe('world'))).toEqual(Maybe.just('hello'));
});
