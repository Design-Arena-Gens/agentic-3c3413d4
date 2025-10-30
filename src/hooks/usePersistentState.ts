'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

type UsePersistentStateReturn<T> = [T, Dispatch<SetStateAction<T>>, boolean];

export function usePersistentState<T>(
  key: string,
  defaultValue: T
): UsePersistentStateReturn<T> {
  const [state, setState] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(false);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedValue = window.localStorage.getItem(key);
    if (storedValue) {
      try {
        setState(JSON.parse(storedValue));
      } catch {
        setState(defaultValue);
      }
    }
    setHydrated(true);
    isFirstLoad.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated || isFirstLoad.current) return;
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [hydrated, key, state]);

  return [state, setState, hydrated];
}
