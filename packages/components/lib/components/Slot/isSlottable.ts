import {isValidElement, ReactElement, ReactNode} from "react";
import Slottable from "./Slottable";

const isSlottable = (child: ReactNode): child is ReactElement => {
  return isValidElement(child) && child.type === Slottable;
};

export default isSlottable;
