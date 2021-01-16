import { ResultOK, ResultOk } from '../src';

test('create new ResultOK', () => {
  new ResultOK(void 0);
});

test('check unwrap ResultOK', ()=>{
  const result = new ResultOK('foo').unwrap();
  expect(result).toBe('foo');
});

test('check unwrapAsync ResultOK', ()=>{
  const result = new ResultOK('foo').unwrapAsync();
  expect(result).resolves.toBe('foo');
});

test('check isOk', () => {
  const result = new ResultOK('foo');
  expect(result.isOk()).toBeTruthy();
});

test('check isFail', () => {
  const result = new ResultOK('foo');
  expect(result.isFail()).toBeFalsy();
});

test('call ResultOk', () => {
  ResultOk(void 0);
});