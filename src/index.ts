export { ResultError, resultError } from 'node-result-error';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace types {
  export type Result<DataType, ErrorType> = ResultOK<DataType> | ResultFAIL<ErrorType>;
  export type ResultAsync<DataType, ErrorType> = Promise<Result<DataType, ErrorType>>;
}

export type ErrorProcessing<DataType, ErrorType> = (error: ErrorType) => DataType;
export type ErrorProcessingAsync<DataType, ErrorType> = (error: ErrorType) => Promise<DataType>;

export class Result<DataType, ErrorType> {
  protected readonly data: DataType;
  protected readonly error: ErrorType;

  constructor(data: DataType, error: ErrorType) {
    this.data = data;
    this.error = error;
  }

  // onErrorAsync(func: ErrorProcessingAsync<D, E>): Promise<D> {
  //   if (this.atom === AtomOK.OK) {
  //     return Promise.resolve(this.data);
  //   }
  //   return func(this.error);
  // }
}

export class ResultOK<DataType> extends Result<DataType, undefined> {
  constructor(data: DataType) {
    super(data, void 0);
  }

  unwrap(): DataType {
    return this.data;
  }

  unwrapAsync(): Promise<DataType> {
    return Promise.resolve(this.data);
  }

  isOk(): boolean {
    return true;
  }

  isFail(): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onError(func: ErrorProcessing<DataType, never>): DataType {
    return this.data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onErrorAsync(func: ErrorProcessingAsync<DataType, never>): Promise<DataType> {
    return Promise.resolve(this.data);
  }
}

export class ResultFAIL<ErrorType> extends Result<undefined, ErrorType> {
  constructor(error: ErrorType) {
    super(void 0, error);
  }

  unwrap(): never {
    throw this.error;
  }

  unwrapAsync(): Promise<ErrorType> {
    return Promise.reject(this.error);
  }

  isOk(): boolean {
    return false;
  }

  isFail(): boolean {
    return true;
  }

  onError<DataType>(func: ErrorProcessing<never, ErrorType>): DataType {
    return func(this.error);
  }

  onErrorAsync<DataType>(func: ErrorProcessingAsync<never, ErrorType>): Promise<DataType> {
    return func(this.error);
  }
}

export const ok = <DataType>(data: DataType): ResultOK<DataType> => new ResultOK(data);
export const fail = <ErrorType>(error: ErrorType): ResultFAIL<ErrorType> => new ResultFAIL(error);

export function tryCatch<C, D, E>(
  target: C,
  property: string,
  descriptor: TypedPropertyDescriptor<(...args: never[]) => D | ResultFAIL<E>>
): TypedPropertyDescriptor<(...args: never[]) => D | ResultFAIL<E>> {
  const self = descriptor.value;
  descriptor.value = function(...args) {
    try {
      if (self instanceof Function) {
        return self.call(this, ...args);
      } else {
        return fail(new TypeError('Descriptor value is not a function.'));
      }
    } catch (error) {
      return fail(error);
    }
  };
  return descriptor;
}

export function tryCatchAsync<C, D, E>(
  target: C,
  property: string,
  descriptor: TypedPropertyDescriptor<(...args: never[]) => Promise<D | ResultFAIL<E>>>
): TypedPropertyDescriptor<(...args: never[]) => Promise<D | ResultFAIL<E>>> {
  const self = descriptor.value;
  descriptor.value = async function(...args) {
    try {
      if (self instanceof Function) {
        return self.call(this, ...args);
      } else {
        return fail(new TypeError('Descriptor value is not a function.'));
      }
    } catch (error) {
      return fail(error);
    }
  };
  return descriptor;
}
