
export type Promise = {
  then: (success: Function, failure: ?Function) => Promise;
  catch: (failure: ?Function) => Promise;
};

export type AbortablePromise<T> = Promise<T> & {
  abort: () => void,
}
