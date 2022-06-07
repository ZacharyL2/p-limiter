# p-limiter

Zero dependency, lightweight concurrent Promise limiter

## Install

```bash
yarn add p-limiter
# or
pnpm add p-limiter
```

## Usage

```ts
import Limiter from 'p-limiter';

const limiter = new Limiter(3);

const mockPromise = (i: number) =>
  new Promise((resolve) => {
    console.log(
      `➕ Start Task${i} -`,
      `Active Count: ${limiter.activeCount}`,
      `Pending Count: ${limiter.pendingCount}`
    );
    setTimeout(() => {
      console.log(
        `✅ Complete Task${i} -`,
        `Active Count: ${limiter.activeCount}`,
        `Pending Count: ${limiter.pendingCount}`
      );
      resolve(i);
    }, i * 1000);
  });

(async () => {
  const results = await Promise.allSettled(
    [...new Array(6)].map((_, i) => limiter.limit(() => mockPromise(i)))
  );
  console.log('results: ', results);
})();
```

## License

[MIT License](./LICENSE)

## Related

- [p-limit](https://github.com/sindresorhus/p-limit) - Run multiple promise-returning & async functions with limited concurrency
