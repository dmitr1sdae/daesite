const removeFromTabOrder = (candidates: HTMLElement[]) => {
  candidates.forEach((candidate) => {
    candidate.dataset.tabindex = candidate.getAttribute("tabindex") || "";
    candidate.setAttribute("tabindex", "-1");
  });
  return () => {
    candidates.forEach((candidate) => {
      const prevTabIndex = candidate.dataset.tabindex as string;
      candidate.setAttribute("tabindex", prevTabIndex);
    });
  };
};

export {removeFromTabOrder};
