import {ComponentPropsWithoutRef, ElementRef, forwardRef} from "react";
import {Norn} from "../Norn";

type VisuallyHiddenElement = ElementRef<typeof Norn.span>;
type NornSpanProps = ComponentPropsWithoutRef<typeof Norn.span>;
interface VisuallyHiddenProps extends NornSpanProps {}

const VisuallyHidden = forwardRef<VisuallyHiddenElement, VisuallyHiddenProps>(
  ({...restProps}, ref) => {
    return (
      <Norn.span
        {...restProps}
        ref={ref}
        style={{
          position: "absolute",
          border: 0,
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          wordWrap: "normal",
          ...restProps.style,
        }}
      />
    );
  },
);

VisuallyHidden.displayName = "VisuallyHidden";

export {VisuallyHidden};
export type {VisuallyHiddenProps};
