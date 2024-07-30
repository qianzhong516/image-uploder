import { useCallback, useEffect } from 'react';
import useIsTopLayer from './useIsTopLayer';
import { useEvent } from './useEvent';

export default function useClickOutside(
  enabled: boolean,
  containers: HTMLElement[],
  cb: (e: MouseEvent | PointerEvent | TouchEvent) => void
) {
  const isTopLayer = useIsTopLayer(enabled, 'click-outside');
  const isReady = enabled && isTopLayer;
  const callback = useEvent(cb);

  const handleClickOutside = useCallback(
    (e: MouseEvent | PointerEvent | TouchEvent) => {
      const target = e.target;
      if (target == null || !(target instanceof HTMLElement)) {
        return;
      }

      for (const container of containers) {
        if (container.contains(target)) {
          return;
        }
      }

      callback(e);
    },
    [containers]
  );

  useEffect(() => {
    if (!isReady) {
      return;
    }

    // TODO: add pointer and touch events support
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside, isReady]);

  if (!isReady) {
    return;
  }
}
