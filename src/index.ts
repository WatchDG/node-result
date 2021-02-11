export { ResultError } from 'node-result-error';

type ErrorProcessing<D, E> = (error: E) => D;
type ErrorProcessingAsync<D, E> = (error: E) => Promise<D>;

export type ReturningResult<D, E> = ResultOK<D> | ResultFAIL<E>;
export type ReturningResultAsync<D, E> = Promise<ResultOK<D> | ResultFAIL<E>>;

/**
 * class Result
 */
export class Result<D, E> {
  protected readonly error: E | null;
  protected readonly data: D;

  constructor(data: D, error: E | null = null) {
    this.error = error;
    this.data = data;
  }

  unwrap(): D | never {
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

  onError(func: ErrorProcessing<D, E>): D {
    if (this.error !== null) {
      return func(this.error);
    }
    return this.data;
  }

  onErrorAsync(func: ErrorProcessingAsync<D, E>): Promise<D> {
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

  isOkAndUnwrap(): [boolean, D | E] {
    if (this.error === null) {
      return [true, this.data];
    }
    return [false, this.error];
  }
}

/**
 * class ResultOK
 */
export class ResultOK<D> extends Result<D, null> {
  constructor(data: D) {
    super(data, null);
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
export class ResultFAIL<E> extends Result<undefined, E> {
  constructor(error: E) {
    super(void 0, error);
  }

  unwrap(): never {
    throw super.error;
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
export function tryCatchWrapper<C, D, E>(
  target: C,
  property: string,
  descriptor: TypedPropertyDescriptor<(...args: never[]) => D | ResultFAIL<E>>
): TypedPropertyDescriptor<(...args: never[]) => D | ResultFAIL<E>> {
  const self = descriptor.value;
  descriptor.value = function (...args) {
    try {
      if (self instanceof Function) {
        return self.call(this, ...args);
      } else {
        return ResultFail(new TypeError('Descriptor value is not a function.'));
      }
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
export function tryCatchWrapperAsync<C, D, E>(
  target: C,
  property: string,
  descriptor: TypedPropertyDescriptor<(...args: never[]) => Promise<D | ResultFAIL<E>>>
): TypedPropertyDescriptor<(...args: never[]) => Promise<D | ResultFAIL<E>>> {
  const self = descriptor.value;
  descriptor.value = async function (...args) {
    try {
      if (self instanceof Function) {
        return self.call(this, ...args);
      } else {
        return ResultFail(new TypeError('Descriptor value is not a function.'));
      }
    } catch (error) {
      return ResultFail(error);
    }
  };
  return descriptor;
}
