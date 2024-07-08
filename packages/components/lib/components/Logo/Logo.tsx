import "./Logo.scss";

import logo from "@daesite/styles/assets/img/brand/dmitr1sdae.webp?url";
import {forwardRef, Ref} from "react";
import {AppLink} from "~/components/Link";
import {Button} from "~/components/Button";
import Image from "next/image";

export interface LogoProps {
  to?: string;
  application?: string;
  "data-testid"?: string;
}

const Logo = forwardRef(
  (
    {application, to, "data-testid": dataTestId, ...restProps}: LogoProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    return (
      <div
        className="rounded-full flex items-center gap-2"
        ref={ref}
        data-testid={dataTestId}
        {...restProps}
      >
        <AppLink
          to="/"
          className="glyph rounded-full overflow-hidden"
          tabIndex={0}
        >
          <Image src={logo} alt="dmitr1sdae" height="48" width="48" />
        </AppLink>
        {application && to && (
          <div className="flex items-center gap-1">
            <span className="text-4xl">/</span>
            <Button
              as={AppLink}
              to={to}
              className="pt-0.5 pr-1 pb-0.5 pl-1 text-xl"
              shape="ghost"
              tabIndex={0}
            >
              {application}
            </Button>
          </div>
        )}
      </div>
    );
  },
);

export default Logo;
