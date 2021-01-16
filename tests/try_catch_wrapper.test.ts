import {
  tryCatchWrapper,
  tryCatchWrapperAsync,
  ResultOk,
  ResultFail,
  ReturningResult,
  ReturningResultAsync,
  ResultOK,
  ResultFAIL
} from '../src';

class TryCatchTest {
  @tryCatchWrapper
  getOk(): ReturningResult<string, Error> {
    return ResultOk('foo');
  }

  @tryCatchWrapperAsync
  async getOkAsync(): ReturningResultAsync<string, Error> {
    return ResultOk('foo');
  }

  @tryCatchWrapper
  getFail(): ReturningResult<string, Error> {
    return ResultFail(new Error('bar'));
  }

  @tryCatchWrapperAsync
  async getFailAsync(): ReturningResultAsync<string, Error> {
    return ResultFail(new Error('bar'));
  }
  
  @tryCatchWrapper
  throwError(): ReturningResult<string, Error>{
    throw new Error('bar');
  }

  @tryCatchWrapper
  throwErrorAsync(): ReturningResult<string, Error>{
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