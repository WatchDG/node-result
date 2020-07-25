type ErrorProcessing<Error, Data> = (error: Error) => Data;
type ErrorProcessingAsync<Error, Data> = (error: Error) => Promise<Data>;

/**
 * Result
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
}

/**
 * ResultOK
 */
export class ResultOK<Error, Data> extends Result<Error, Data> {
  constructor(data: Data, error: Error) {
    super(error, data);
  }
}

/**
 * ResultFAIL
 */
export class ResultFAIL<Error, Data> extends Result<Error, Data> {
  constructor(error: Error, data: Data) {
    super(error, data);
  }
}

export const ResultOk = <Data>(data: Data) => new ResultOK(data, null);

export const ResultFail = <Error>(error: Error) => new ResultFAIL(error, void 0);
