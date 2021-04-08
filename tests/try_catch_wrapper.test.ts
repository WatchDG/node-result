import {
  tryCatch,
  tryCatchAsync,
  ok,
  fail,
  ResultOK,
  ResultFAIL
} from '../src';
import type {
  TResult,
  TResultAsync
} from '../src';

class TryCatchTest {
  @tryCatch
  getOk(): TResult<string, Error> {
    return ok('foo');
  }

  @tryCatchAsync
  async getOkAsync(): TResultAsync<string, Error> {
    return ok('foo');
  }

  @tryCatch
  getFail(): TResult<string, Error> {
    return fail(new Error('bar'));
  }

  @tryCatchAsync
  async getFailAsync(): TResultAsync<string, Error> {
    return fail(new Error('bar'));
  }
  
  @tryCatch
  throwError(): TResult<string, Error>{
    throw new Error('bar');
  }

  @tryCatch
  throwErrorAsync(): TResult<string, Error>{
    throw new Error('bar');
  }
}

test('tryCatchWrapper with ResultOK', () => {
  const user = new TryCatchTest();
  const result = user.getOk();
  expect(result).toBeInstanceOf(ResultOK);
  expect(result.unwrap()).toBe('foo');
});

test('tryCatchWrapperAsync with ResultOK', async () => {
  const user = new TryCatchTest();
  const result = await user.getOkAsync();
  expect(result).toBeInstanceOf(ResultOK);
  expect(result.unwrap()).toBe('foo');
});

test('tryCatchWrapper with ResultFAIL', () => {
  const user = new TryCatchTest();
  const result = user.getFail();
  expect(result).toBeInstanceOf(ResultFAIL);
  expect(result.unwrap).toThrowError();
});

test('tryCatchWrapperAsync with ResultFAIL', async () => {
  const user = new TryCatchTest();
  const result = await user.getFailAsync();
  expect(result).toBeInstanceOf(ResultFAIL);
  expect(result.unwrap).toThrowError();
});