# node-result

## install

```shell
npm install node-result
# or
yarn add node-result
```

## example

```ts
import {ResultOk, ResultFail} from "node-result";

async function checkIfNotString(data: any) {
    try {
        if (typeof data !== 'string') {
            return ResultFail(void 0);
        }
        return ResultOk(null);
    } catch (error) {
        return ResultFail(error);
    }
}

(async () => {

    (await checkIfNotString('foo'));
    // return Result
    (await checkIfNotString(5));
    // return Result
    (await checkIfNotString('bar'));
    // return Result

    (await checkIfNotString('foo')).unwrap();
    // return null
    (await checkIfNotString(5)).unwrap();
    // throw undefined or Error
    (await checkIfNotString('bar')).unwrap();
    // not done

})();
```