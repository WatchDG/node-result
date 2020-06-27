type ResultError = Error;
type ResultData = null | void | string | number | boolean | object | any[];

export class Result {
  readonly #error: ResultError | null;
  readonly #data: ResultData;

  constructor(error: ResultError | null = null, data: ResultData) {
    this.#error = error;
    this.#data = data;
  }

  unwrap() {
    if (this.#error !== null) {
      throw this.#error;
    }
    return this.#data;
  }

  unwrapAsync() {
    if (this.#error !== null) {
      return Promise.reject(this.#error);
    }
    return Promise.resolve(this.#data);
  }
}

export const ResultOk = (data: ResultData) => new Result(null, data);

export const ResultFail = (error: ResultError) => new Result(error, void 0);
