export class StoreFactory<T> {
  constructor(
    public factory: () => T,
    public map: Map<string, T> = new Map([])
  ) {}

  get(scope: string): T {
    const result = this.map.get(scope);
    if (!result) {
      const store = this.factory();
      this.map.set(scope, store);
      return store;
    }

    return result;
  }
}
