import {
  ComponentPropsWithRef,
  ElementType,
  forwardRef,
  ForwardRefExoticComponent,
} from "react";
import {Slot} from "../Slot";

const NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul",
] as const;

type Norns = {[E in (typeof NODES)[number]]: NornForwardRefComponent<E>};
type NornPropsWithRef<E extends ElementType> = ComponentPropsWithRef<E> & {
  asChild?: boolean;
};

interface NornForwardRefComponent<E extends ElementType>
  extends ForwardRefExoticComponent<NornPropsWithRef<E>> {}

const Norn = NODES.reduce((primitive, node) => {
  const Node = forwardRef(
    (props: NornPropsWithRef<typeof node>, forwardedRef: any) => {
      const {asChild, ...primitiveProps} = props;
      const Comp: any = asChild ? Slot : node;

      if (typeof window !== "undefined") {
        (window as any)[Symbol.for("radix-ui")] = true;
      }

      return <Comp {...primitiveProps} ref={forwardedRef} />;
    },
  );

  Node.displayName = `Norn.${node}`;

  return {...primitive, [node]: Node};
}, {} as Norns);

export default Norn;
