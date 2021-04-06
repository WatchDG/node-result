import {
  tryCatch,
  tryCatchAsync,
  ok,
  fail,
  ResultOK,
  ResultFAIL
} from '../src';
import type {
  types
} from '../src';
type Result<DataType, ErrorType> = types.Result<DataType, ErrorType>;
type ResultAsync<DataType, ErrorType> = types.ResultAsync<DataType, ErrorType>;

class TryCatchTest {
  @tryCatch
  getOk(): Result<string, Error> {
    return ok('foo');
  }

  @tryCatchAsync
  async getOkAsync(): ResultAsync<string, Error> {
    return ok('foo');
  }

  @tryCatch
  getFail(): Result<string, Error> {
    return fail(new Error('bar'));
  }

  @tryCatchAsync
  async getFailAsync(): ResultAsync<string, Error> {
    return fail(new Error('bar'));
  }
  
  @tryCatch
  throwError(): Result<string, Error>{
    throw new Error('bar');
  }

  @tryCatch
  throwErrorAsync(): Result<string, Error>{
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