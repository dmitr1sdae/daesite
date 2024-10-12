// Can't loop over DOMRect keys with getOwnPropertyNames.
const keys = ["bottom", "height", "left", "right", "top", "width", "x", "y"];
const isEquivalent = (aRect?: DOMRect, bRect?: DOMRect) => {
  if (!aRect && bRect) {
    return false;
  }
  if (aRect && !bRect) {
    return false;
  }
  for (const key of keys) {
    if (aRect?.[key as keyof DOMRect] !== bRect?.[key as keyof DOMRect]) {
      return false;
    }
  }
  return true;
};

const equivalentReducer = (oldRect?: DOMRect, newRect?: DOMRect) => {
  return isEquivalent(oldRect, newRect) ? oldRect : newRect;
};

export {equivalentReducer};
