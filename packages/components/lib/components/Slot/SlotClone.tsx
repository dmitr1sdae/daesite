import {composeRefs} from "@daesite/utils";
import {Children, cloneElement, forwardRef, isValidElement, ReactNode} from "react";
import mergeProps from "./mergeProps";
import getElementRef from "./getElementRef";

interface SlotCloneProps {
  children: ReactNode;
}

const SlotClone = forwardRef<any, SlotCloneProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;

  if (isValidElement(children)) {
    const childrenRef = getElementRef(children);
    return cloneElement(children, {
      ...mergeProps(slotProps, children.props),
      // @ts-ignore
      ref: forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef,
    });
  }

  return Children.count(children) > 1 ? Children.only(null) : null;
});

SlotClone.displayName = 'SlotClone';

export default SlotClone;
