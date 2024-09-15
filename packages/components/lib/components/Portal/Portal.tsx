"use client";

import {ReactNode, useEffect, useState} from "react";
import {createPortal} from "react-dom";
import type {ReactPortal} from "react";

interface PortalProps {
  children: ReactNode;
}

const Portal = ({children}: PortalProps): ReactPortal | null => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted
    ? createPortal(children, document.getElementById("__portalRoot")!)
    : null;
};

export {Portal};
