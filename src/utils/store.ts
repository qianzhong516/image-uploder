type Fn = () => void;

type Store<StateDefinition, ActionKey> = {
  subscribe(listener: Fn): Fn;
  getSnapshot(): StateDefinition;
  dispatch(action: ActionKey, ...args: any[]): void;
};

type Actions<StateDefinition, ActionKeys extends string> = {
  [P in ActionKeys]: (
    this: StateDefinition,
    ...args: any[]
  ) => StateDefinition;
};

export function createStore<
  StateDefinition,
  ActionKey extends string,
>(
  initState: () => StateDefinition,
  actions: Actions<StateDefinition, ActionKey>
): Store<StateDefinition, ActionKey> {
  let state = initState();
  let listeners: Fn[] = [];

  return {
    subscribe(listener: Fn) {
      listeners = [...listeners, listener];
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    getSnapshot() {
      return state;
    },
    dispatch(actionKey: ActionKey, ...args: any[]) {
      state = actions[actionKey].call(state, ...args);
      for (let listener of listeners) {
        listener();
      }
    },
  };
}
