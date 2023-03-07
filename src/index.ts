export type TResult<DataType, ErrorType> = Ok<DataType> | Err<ErrorType>;
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

export class Ok<DataType> extends Result<DataType, null> {
  constructor(data: DataType) {
    super(data, null);
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

  isErr(): boolean {
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

export class Err<ErrorType> extends Result<null, ErrorType> {
  constructor(error: ErrorType) {
    super(null, error);
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

  isErr(): boolean {
    return true;
  }

  onError<DataType>(func: TErrorProcessing<never, ErrorType>): DataType {
    return func(this.error);
  }

  onErrorAsync<DataType>(func: TErrorProcessingAsync<never, ErrorType>): Promise<DataType> {
    return func(this.error);
  }
}

export function ok<DataType>(data: DataType): Ok<DataType> {
  return new Ok(data);
}

export function err<ErrorType>(error: ErrorType): Err<ErrorType> {
  return new Err(error);
}

export function tryCatch<TargetType, DataType, ErrorType>(
  target: TargetType,
  property: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => DataType | Err<ErrorType>>
): TypedPropertyDescriptor<(...args: any[]) => DataType | Err<ErrorType>> {
  const self = descriptor.value;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  descriptor.value = function(...args): DataType | Err<any> {
    try {
      if (self instanceof Function) {
        return self.apply(this, args);
      } else {
        return err(new TypeError('Descriptor value is not a function.'));
      }
    } catch (error) {
      return err(error);
    }
  };
  return descriptor;
}

export function tryCatchAsync<TargetType, DataType, ErrorType>(
  target: TargetType,
  property: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<DataType | Err<ErrorType>>>
): TypedPropertyDescriptor<(...args: any[]) => Promise<DataType | Err<ErrorType>>> {
  const self = descriptor.value;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  descriptor.value = async function(...args): Promise<DataType | Err<any>> {
    try {
      if (self instanceof Function) {
        return self.apply(this, args);
      } else {
        return err(new TypeError('Descriptor value is not a function.'));
      }
    } catch (error) {
      return err(error);
    }
  };
  return descriptor;
}
