import { Err, err } from '../src';

test('create new Err', () => {
  new Err(void 0);
});

test('check unwrap Err', () => {
  const error = new Error('foo');
  expect(new Err(error).unwrap).toThrowError();
});

test('check unwrapAsync Err', () => {
  const error = new Error('foo');
  const result = new Err(error).unwrapAsync();
  expect(result).rejects.toBe(error);
});

test('check isOk', () => {
  const error = new Error('foo');
  const result = new Err(error);
  expect(result.isOk()).toBeFalsy();
});

test('check isErr', () => {
  const error = new Error('foo');
  const result = new Err(error);
  expect(result.isErr()).toBeTruthy();
});

test('call fail', () => {
  err(void 0);
});