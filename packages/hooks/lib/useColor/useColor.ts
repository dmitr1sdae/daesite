const useColor = (str?: string) => {
  if (!str) {
    return "var(--primary)";
  }

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  hash = (hash ^ 0x1f0d88) & 0xffffff;

  const brightness =
    (0.2126 * ((hash >> 16) & 0xff) +
      0.7152 * ((hash >> 8) & 0xff) +
      0.0722 * (hash & 0xff)) /
    255;

  if (brightness < 0.2) {
    hash = hash + 0x666666;
  } else if (brightness > 0.8) {
    hash = hash - 0x666666;
  }

  let color = "#";
  for (let j = 0; j < 3; j++) {
    let value = (hash >> (j * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }

  return color;
};

export default useColor;
