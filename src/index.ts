class Queue<T> {
  #tasks: T[] = [];

  enqueue = (task: T) => {
    this.#tasks.push(task);
  };

  dequeue = () => this.#tasks.shift();

  clear = () => {
    this.#tasks = [];
  };

  get size() {
    return this.#tasks.length;
  }
}

class PromiseLimiter {
  #queue = new Queue<() => Promise<void>>();
  #runningCount = 0;
  #limitCount: number;

  constructor(limitCount: number) {
    this.#limitCount = limitCount;
  }

  #next = () => {
    if (this.#runningCount < this.#limitCount && this.#queue.size > 0) {
      this.#queue.dequeue()?.();
    }
  };

  #run = async <R = any>(
    fn: () => Promise<R>,
    resolve: (value: PromiseLike<R>) => void
  ) => {
    this.#runningCount += 1;
    const result = (async () => fn())();
    resolve(result);

    try {
      await result;
    } catch {
      // ignore
    }

    this.#runningCount -= 1;
    this.#next();
  };

  get activeCount() {
    return this.#runningCount;
  }

  get pendingCount() {
    return this.#queue.size;
  }

  limit = <R = any>(fn: () => Promise<R>) =>
    new Promise<R>((resolve) => {
      this.#queue.enqueue(() => this.#run(fn, resolve));
      this.#next();
    });
}

export default PromiseLimiter;
