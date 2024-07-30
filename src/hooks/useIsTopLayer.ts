import { createStore } from '@/utils/store';
import { StoreFactory } from '@/utils/storeFactory';
import { useEffect, useId, useSyncExternalStore } from 'react';

enum ActionTypes {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

// create stores that share data across multiple components
const layerStores = new StoreFactory(() =>
  createStore(() => [] as string[], {
    [ActionTypes.ADD](this: string[], id: string) {
      return Array.from(new Set(this)).concat([id]);
    },
    [ActionTypes.REMOVE](this: string[], id: string) {
      const index = this.indexOf(id);
      if (index < 0) {
        return this;
      }
      const copy = [...this];
      copy.splice(index, 1);
      return copy;
    },
  })
);

export default function useIsTopLayer(
  enabled: boolean,
  scope: string
) {
  const id = useId();
  const layerStore = layerStores.get(scope);
  const layers = useSyncExternalStore(
    layerStore.subscribe,
    layerStore.getSnapshot,
    layerStore.getSnapshot
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    layerStore.dispatch(ActionTypes.ADD, id);

    return () => {
      layerStore.dispatch(ActionTypes.REMOVE, id);
    };
  }, [enabled, id, layerStore]);

  if (!enabled) {
    return;
  }

  let index = layers.indexOf(id);
  let len = layers.length;

  // assume this component will be soon inserted onto the top layer
  if (index < 0) {
    index = layers.length;
    len += 1;
  }

  return index === len - 1;
}
