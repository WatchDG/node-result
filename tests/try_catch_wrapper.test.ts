import {
  tryCatch,
  tryCatchAsync,
  ok,
  err,
  Ok,
  Err
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
    return err(new Error('bar'));
  }

  @tryCatchAsync
  async getFailAsync(): TResultAsync<string, Error> {
    return err(new Error('bar'));
  }

  @tryCatch
  throwError(): TResult<string, Error> {
    throw new Error('bar');
  }

  @tryCatch
  throwErrorAsync(): TResult<string, Error> {
    throw new Error('bar');
  }
}

test('tryCatchWrapper with Ok', () => {
  const user = new TryCatchTest();
  const result = user.getOk();
  expect(result).toBeInstanceOf(Ok);
  expect(result.unwrap()).toBe('foo');
});

test('tryCatchWrapperAsync with Ok', async () => {
  const user = new TryCatchTest();
  const result = await user.getOkAsync();
  expect(result).toBeInstanceOf(Ok);
  expect(result.unwrap()).toBe('foo');
});

test('tryCatchWrapper with Err', () => {
  const user = new TryCatchTest();
  const result = user.getFail();
  expect(result).toBeInstanceOf(Err);
  expect(result.unwrap).toThrowError();
});

test('tryCatchWrapperAsync with Err', async () => {
  const user = new TryCatchTest();
  const result = await user.getFailAsync();
  expect(result).toBeInstanceOf(Err);
  expect(result.unwrap).toThrowError();
});