import {AnchorHTMLAttributes, forwardRef, Ref} from "react";
import {default as NextLink} from "next/link";

type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "color"> & {
  /**
   * Provide the link href.
   */
  to: string;
  /**
   * Controls self opening.
   */
  selfOpening?: boolean;
};

const AppLink = (
  {to, selfOpening = false, children, ...rest}: AppLinkProps,
  ref: Ref<HTMLAnchorElement>,
) => {
  if (selfOpening) {
    return (
      <a ref={ref} href={to} target="_self" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <NextLink ref={ref} href={to} {...rest}>
      {children}
    </NextLink>
  );
};

export default forwardRef<HTMLAnchorElement, AppLinkProps>(AppLink);
