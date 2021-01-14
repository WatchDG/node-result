export { ResultError } from 'node-result-error';

type ErrorProcessing<E, D> = (error: E) => D;
type ErrorProcessingAsync<E, D> = (error: E) => Promise<D>;

export type ResultType<E, D> = ResultOK<E> | ResultFAIL<D>;

/**
 * class Result
 */
export class Result<E, D> {
  protected readonly error: E | null;
  protected readonly data: D;

  constructor(error: E | null = null, data: D) {
    this.error = error;
    this.data = data;
  }

  unwrap(): D {
    if (this.error !== null) {
      throw this.error;
    }
    return this.data;
  }

  unwrapAsync(): Promise<D | E> {
    if (this.error !== null) {
      return Promise.reject(this.error);
    }
    return Promise.resolve(this.data);
  }

  onError(func: ErrorProcessing<E, D>): D {
    if (this.error !== null) {
      return func(this.error);
    }
    return this.data;
  }

  async onErrorAsync(func: ErrorProcessingAsync<E, D>): Promise<D> {
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
export class ResultOK<D> extends Result<null, D> {
  constructor(data: D) {
    super(null, data);
  }

  unwrap(): D {
    return this.data;
  }

  unwrapAsync(): Promise<D> {
    return Promise.resolve(this.data);
  }
}

/**
 * class ResultFAIL
 */
export class ResultFAIL<E> extends Result<E, undefined> {
  constructor(error: E) {
    super(error, void 0);
  }

  unwrap(): never {
    throw this.error;
  }

  unwrapAsync(): Promise<E> {
    return Promise.reject(this.error);
  }
}

/**
 * get a new instance of ResultOK
 * @param data
 * @constructor
 */
export const ResultOk = <D>(data: D): ResultOK<D> => new ResultOK(data);

/**
 * get a new instance of ResultFAIL
 * @param error
 * @constructor
 */
export const ResultFail = <E>(error: E): ResultFAIL<E> => new ResultFAIL(error);

/**
 * `try catch` decorator for sync method
 * @param target
 * @param property
 * @param descriptor
 */
export function tryCatchWrapper(
  target: Record<any, any>,
  property: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
): TypedPropertyDescriptor<(...args: any[]) => ResultOK<any> | ResultFAIL<Error>> {
  const self = descriptor.value;
  descriptor.value = function(...args) {
    try {
      return self?.call(this, ...args);
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
  target: Record<any, any>,
  property: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>
): TypedPropertyDescriptor<(...args: any[]) => Promise<ResultOK<any> | ResultFAIL<Error>>> {
  const self = descriptor.value;
  descriptor.value = async function(...args) {
    try {
      return await self?.call(this, ...args);
    } catch (error) {
      return ResultFail(error);
    }
  };
  return descriptor;
}
