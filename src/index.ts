export type TResult<DataType, ErrorType> = ResultOK<DataType> | ResultFAIL<ErrorType>;
export type TResultAsync<DataType, ErrorType> = Promise<TResult<DataType, ErrorType>>;

export type TErrorProcessing<DataType, ErrorType> = (error: ErrorType) => DataType;
export type TErrorProcessingAsync<DataType, ErrorType> = (error: ErrorType) => Promise<DataType>;

export class Result<DataType, ErrorType> {
  protected readonly data: DataType;
  protected readonly error: ErrorType;

  constructor(data: DataType, error: ErrorType) {
    this.data = data;
    this.error = error;
  }
}

export class ResultOK<DataType> extends Result<DataType, undefined> {
  constructor(data: DataType) {
    super(data, undefined);
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
  onError(func: TErrorProcessing<DataType, never>): DataType {
    return this.data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onErrorAsync(func: TErrorProcessingAsync<DataType, never>): Promise<DataType> {
    return Promise.resolve(this.data);
  }
}

export class ResultFAIL<ErrorType> extends Result<undefined, ErrorType> {
  constructor(error: ErrorType) {
    super(undefined, error);
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

  onError<DataType>(func: TErrorProcessing<never, ErrorType>): DataType {
    return func(this.error);
  }

  onErrorAsync<DataType>(func: TErrorProcessingAsync<never, ErrorType>): Promise<DataType> {
    return func(this.error);
  }
}

export function ok<DataType>(data: DataType): ResultOK<DataType> {
  return new ResultOK(data);
}

export function fail<ErrorType>(error: ErrorType): ResultFAIL<ErrorType> {
  return new ResultFAIL(error);
}

export function tryCatch<TargetType, DataType, ErrorType>(
  target: TargetType,
  property: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => DataType | ResultFAIL<ErrorType>>
): TypedPropertyDescriptor<(...args: any[]) => DataType | ResultFAIL<ErrorType>> {
  const self = descriptor.value;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  descriptor.value = function (...args): DataType | ResultFAIL<any> {
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

export function tryCatchAsync<TargetType, DataType, ErrorType>(
  target: TargetType,
  property: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<DataType | ResultFAIL<ErrorType>>>
): TypedPropertyDescriptor<(...args: any[]) => Promise<DataType | ResultFAIL<ErrorType>>> {
  const self = descriptor.value;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  descriptor.value = async function (...args): Promise<DataType | ResultFAIL<any>> {
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
