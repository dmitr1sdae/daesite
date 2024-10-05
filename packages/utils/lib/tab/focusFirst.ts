const focusFirst = (candidates: HTMLElement[]) => {
  const previouslyFocusedElement = document.activeElement;
  return candidates.some((candidate) => {
    // if focus is already where we want to go, we don't want to keep going through the candidates
    if (candidate === previouslyFocusedElement) {
      return true;
    }
    candidate.focus();
    return document.activeElement !== previouslyFocusedElement;
  });
};

export {focusFirst};
