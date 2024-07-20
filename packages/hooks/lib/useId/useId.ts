import React, {useState} from "react";
import {useSafeLayoutEffect} from "~/useSafeLayoutEffect";

const useReactId = (React as any)["useId".toString()] || (() => undefined);
let count = 0;

const useId = (deterministicId?: string): string => {
  const [id, setId] = useState<string | undefined>(useReactId());
  useSafeLayoutEffect(() => {
    if (!deterministicId) {
      setId((reactId) => reactId ?? String(count++));
    }
  }, [deterministicId]);
  return deterministicId || (id ? `redae-${id}` : "");
};

export default useId;
