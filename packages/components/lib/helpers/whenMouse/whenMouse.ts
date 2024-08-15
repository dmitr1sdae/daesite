import { PointerEventHandler } from "react";

const whenMouse = <E>(
  handler: PointerEventHandler<E>,
): PointerEventHandler<E> => {
  return (event) =>
    event.pointerType === "mouse" ? handler(event) : undefined;
}

export {whenMouse};
