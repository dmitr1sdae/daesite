"use client";

import {createContext, ReactNode} from "react";

type Direction = "ltr" | "rtl";
const DirectionContext = createContext<Direction | undefined>(undefined);

interface DirectionProviderProps {
  children?: ReactNode;
  dir: Direction;
}
const DirectionProvider = ({dir, children}: DirectionProviderProps) => {
  return (
    <DirectionContext.Provider value={dir}>
      {children}
    </DirectionContext.Provider>
  );
};

export {DirectionContext, DirectionProvider};
export type {Direction};
