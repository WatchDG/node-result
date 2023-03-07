import { Ok, ok } from '../src';

test('create new Ok', () => {
  new Ok(void 0);
});

test('check unwrap Ok', () => {
  const result = new Ok('foo').unwrap();
  expect(result).toBe('foo');
});

test('check unwrapAsync Ok', () => {
  const result = new Ok('foo').unwrapAsync();
  expect(result).resolves.toBe('foo');
});

test('check isOk', () => {
  const result = new Ok('foo');
  expect(result.isOk()).toBeTruthy();
});

test('check isErr', () => {
  const result = new Ok('foo');
  expect(result.isErr()).toBeFalsy();
});

test('call ok', () => {
  ok(void 0);
});