import {useCallback} from "react";
import {composeRefs, PossibleRef} from "@daesite/utils";

/**
 * A hook that composes multiple refs
 * Accepts callback refs and RefObject(s)
 */
const useComposedRefs = <T>(...refs: PossibleRef<T>[]) => {
  return useCallback(composeRefs(...refs), refs);
};

export {useComposedRefs};
