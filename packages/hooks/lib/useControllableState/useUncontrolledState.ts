"use client";

import {useEffect, useRef, useState} from "react";
import {useCallbackRef} from "~/useCallbackRef";

type UseUncontrolledStateProps<T> = {
  prop?: T | undefined;
  defaultProp?: T | undefined;
  onChange?: (state: T) => void;
};

const useUncontrolledState = <T>({
  defaultProp,
  onChange,
}: Omit<UseUncontrolledStateProps<T>, "prop">) => {
  const uncontrolledState = useState<T | undefined>(defaultProp);
  const [value] = uncontrolledState;
  const prevValueRef = useRef(value);
  const handleChange = useCallbackRef(onChange);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value as T);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef, handleChange]);

  return uncontrolledState;
};

export {useUncontrolledState};
