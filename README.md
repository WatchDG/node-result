# node-result

## install

```shell
npm install node-result
# or
yarn add node-result
```

## example

```ts
import { ok, fail } from "node-result";

async function checker(data: any) {
  try {
    if (typeof data !== 'string') {
      return fail(void 0);
    }
    return ok(null);
  } catch (error) {
    return fail(error);
  }
}

(async () => {
  (await checker('foo'));           // return Result
  (await checker(5));               // return Result
  (await checker('bar'));           // return Result

  (await checker('foo')).unwrap();  // return null
  (await checker(5)).unwrap();      // throw undefined
  (await checker('bar')).unwrap();  // not done
})();
```