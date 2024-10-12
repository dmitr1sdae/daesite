"use client";

import {setupListeners} from "@reduxjs/toolkit/query";
import {ReactNode, useEffect, useRef} from "react";
import {Provider} from "react-redux";

import {AppStore, makeStore} from "~/store";

interface StoreProviderProps {
  children: ReactNode;
}

const StoreProvider = ({children}: StoreProviderProps) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (storeRef.current != null) {
      // configure listeners using the provided defaults
      // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
      const unsubscribe = setupListeners(storeRef.current.dispatch);
      return unsubscribe;
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
};

export {StoreProvider};
