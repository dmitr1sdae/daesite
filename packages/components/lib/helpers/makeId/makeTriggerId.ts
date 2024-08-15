const makeTriggerId = (baseId: string, value: string) => {
  return `${baseId}-trigger-${value}`;
};

export {makeTriggerId};
