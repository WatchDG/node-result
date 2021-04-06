import { ResultFAIL, fail } from '../src';

test('create new ResultFAIL', () => {
  new ResultFAIL(void 0);
});

test('check unwrap ResultFAIL', () => {
  const error = new Error('foo');
  expect(new ResultFAIL(error).unwrap).toThrowError();
});

test('check unwrapAsync ResultFAIL', () => {
  const error = new Error('foo');
  const result = new ResultFAIL(error).unwrapAsync();
  expect(result).rejects.toBe(error);
});

test('check isOk', () => {
  const error = new Error('foo');
  const result = new ResultFAIL(error);
  expect(result.isOk()).toBeFalsy();
});

test('check isFail', () => {
  const error = new Error('foo');
  const result = new ResultFAIL(error);
  expect(result.isFail()).toBeTruthy();
});

test('call ResultFail', () => {
  fail(void 0);
});