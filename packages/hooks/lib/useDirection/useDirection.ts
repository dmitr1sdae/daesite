"use client";

import {useContext} from "react";
import {Direction, DirectionContext} from "./DirectionProvider";

const useDirection = (localDir?: Direction) => {
  const globalDir = useContext(DirectionContext);
  return localDir || globalDir || "ltr";
}

export {useDirection};
