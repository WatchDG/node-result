export { ResultError } from 'node-result-error';

export enum AtomOK {
  OK = 'OK'
}

export enum AtomFAIL {
  FAIL = 'FAIL'
}

type Atom = typeof AtomOK.OK | typeof AtomFAIL.FAIL;

export type ErrorProcessing<D, E> = (error: E) => D;
export type ErrorProcessingAsync<D, E> = (error: E) => Promise<D>;

export type ReturningResult<D, E> = ResultOK<D> | ResultFAIL<E>;
export type ReturningResultAsync<D, E> = Promise<ResultOK<D> | ResultFAIL<E>>;

/**
 * class Result
 */
export class Result<D, E> {
  protected readonly data: D;
  protected readonly error: E;
  protected readonly atom: Atom;

  constructor(data: D, error: E, atom: Atom = AtomOK.OK) {
    this.data = data;
    this.error = error;
    this.atom = atom;
  }

  onError(func: ErrorProcessing<D, E>): D {
    if (this.atom === AtomOK.OK) {
      return this.data;
    }
    return func(this.error);
  }

  onErrorAsync(func: ErrorProcessingAsync<D, E>): Promise<D> {
    if (this.atom === AtomOK.OK) {
      return Promise.resolve(this.data);
    }
    return func(this.error);
  }

  isOk(): boolean {
    return this.atom === AtomOK.OK;
  }

  isFail(): boolean {
    return this.atom !== AtomOK.OK;
  }
}

/**
 * class ResultOK
 */
export class ResultOK<D> extends Result<D, undefined> {
  constructor(data: D) {
    super(data, void 0, AtomOK.OK);
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
    super(void 0, error, AtomFAIL.FAIL);
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
