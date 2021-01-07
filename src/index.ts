export { ResultError } from 'node-result-error';

type ErrorProcessing<Error, Data> = (error: Error) => Data;
type ErrorProcessingAsync<Error, Data> = (error: Error) => Promise<Data>;

/**
 * class Result
 */
export class Result<Error, Data> {
  private readonly error: Error | null;
  private readonly data: Data;

  constructor(error: Error | null = null, data: Data) {
    this.error = error;
    this.data = data;
  }

  unwrap(): Data {
    if (this.error !== null) {
      throw this.error;
    }
    return this.data;
  }

  unwrapAsync(): Promise<Data> {
    if (this.error !== null) {
      return Promise.reject(this.error);
    }
    return Promise.resolve(this.data);
  }

  onError(func: ErrorProcessing<Error, Data>): Data {
    if (this.error !== null) {
      return func(this.error);
    }
    return this.data;
  }

  async onErrorAsync(func: ErrorProcessingAsync<Error, Data>): Promise<Data> {
    if (this.error !== null) {
      return func(this.error);
    }
    return Promise.resolve(this.data);
  }

  isOk(): boolean {
    return this.error === null;
  }

  isFail(): boolean {
    return this.error !== null;
  }
}

/**
 * class ResultOK
 */
export class ResultOK<Data> extends Result<null, Data> {
  constructor(data: Data) {
    super(null, data);
  }
}

/**
 * class ResultFAIL
 */
export class ResultFAIL<Error> extends Result<Error, undefined> {
  constructor(error: Error) {
    super(error, void 0);
  }
}

/**
 * get a new instance of ResultOK
 * @param data
 * @constructor
 */
export const ResultOk = <Data>(data: Data) => new ResultOK(data);

/**
 * get a new instance of ResultFAIL
 * @param error
 * @constructor
 */
export const ResultFail = <Error>(error: Error) => new ResultFAIL(error);

/**
 * `try catch` decorator for sync method
 * @param target
 * @param property
 * @param descriptor
 */
export function tryCatchWrapper(
  target: object,
  property: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
) {
  const self = descriptor.value;
  descriptor.value = function (...args) {
    try {
      return self!.call(this, ...args);
    } catch (error) {
      return ResultFail(error);
    }
  };
  return descriptor;
}

/**
 * `try catch` decorator for async method
 * @param target
 * @param property
 * @param descriptor
 */
export function tryCatchWrapperAsync(
  target: object,
  property: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>
) {
  const self = descriptor.value;
  descriptor.value = async function (...args) {
    try {
      return await self!.call(this, ...args);
    } catch (error) {
      return ResultFail(error);
    }
  };
  return descriptor;
}
