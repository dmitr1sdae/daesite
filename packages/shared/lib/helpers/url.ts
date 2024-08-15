export const getSecondLevelDomain = (hostname: string) => {
  return hostname.slice(hostname.indexOf(".") + 1);
};
