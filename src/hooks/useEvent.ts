import { useEffect, useRef } from 'react';

type Fn<Args extends Array<any>, Result> = (...args: Args) => Result;

/**
 * Eliminate function dependencies from side effects such as useEffect,
 * useLayoutEffect etc.
 */
export function useEvent<Args extends Array<any>, Result>(
  cb: Fn<Args, Result>
) {
  const latestCb = useRef<Fn<Args, Result>>();

  useEffect(() => {
    latestCb.current = cb;
  }, [cb]);

  const stableCb = useRef<Fn<Args, Result> | null>(null);
  if (!stableCb.current) {
    stableCb.current = function (...args: Args) {
      if (!latestCb.current) {
        // Render methods should be pure.
        throw new Error(
          'The callback from useEvent cannot be invoked before the component has mounted.'
        );
      }
      return latestCb.current.apply(this, args);
    };
  }

  return stableCb.current;
}
