import "./Logo.scss";

import {PolymorphicPropsWithRef} from "@daesite/react-polymorphic-types";
import logo from "@daesite/styles/assets/img/brand/logo.webp";
import {ElementType, forwardRef, Ref} from "react";

interface LogoOwnProps {
  "data-testid"?: string;
}

export type LogoProps<E extends ElementType> = PolymorphicPropsWithRef<
  LogoOwnProps,
  E
>;

const defaultElement = "div";

const Logo = <E extends ElementType = typeof defaultElement>(
  {
    as,
    "data-testid": dataTestId,
    ...restProps
  }: LogoProps<E>,
  ref: Ref<Element>,
) => {
  const Element: ElementType = as || defaultElement;

  return (
    <Element
      className="logo"
      ref={ref}
      data-testid={dataTestId}
      {...restProps}
    >
      <img src={logo} alt="dmitr1sdae" height="48" width="48" />
    </Element>
  );
};

export default forwardRef(Logo);
