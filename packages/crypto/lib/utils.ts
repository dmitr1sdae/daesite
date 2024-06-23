const ifDefined = <T, R>(cb: (input: T) => R) => {
  return <U extends T | undefined>(input: U) => {
    return (input !== undefined ? cb(input as T) : undefined) as U extends T
      ? R
      : undefined;
  };
};
export const encodeUtf8 = ifDefined((input: string) =>
  encodeURIComponent(input),
);
export const decodeUtf8 = ifDefined((input: string) =>
  decodeURIComponent(input),
);
export const encodeBase64 = ifDefined((input: string) => btoa(input).trim());
export const decodeBase64 = ifDefined((input: string) => atob(input.trim()));
export const encodeUtf8Base64 = ifDefined((input: string) =>
  encodeBase64(encodeUtf8(input)),
);
export const decodeUtf8Base64 = ifDefined((input: string) =>
  decodeUtf8(decodeBase64(input)),
);

const isString = (data: any): data is string | String => {
  return typeof data === "string" || data instanceof String;
};

/**
 * Convert a string to an array of 8-bit integers
 * @param str String to convert
 * @returns An array of 8-bit integers
 */
export const binaryStringToArray = (str: string) => {
  if (!isString(str)) {
    throw new Error(
      "binaryStringToArray: Data must be in the form of a string",
    );
  }

  const result = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    result[i] = str.charCodeAt(i);
  }
  return result;
};

/**
 * Encode an array of 8-bit integers as a string
 * @param bytes data to encode
 * @return string-encoded bytes
 */
export const arrayToBinaryString = (bytes: Uint8Array) => {
  const result = [];
  const bs = 1 << 14;
  const j = bytes.length;

  for (let i = 0; i < j; i += bs) {
    result.push(
      String.fromCharCode.apply(
        String,
        // @ts-ignore Uint8Array treated as number[]
        bytes.subarray(i, i + bs < j ? i + bs : j),
      ),
    );
  }
  return result.join("");
};

/**
 * Convert a hex string to an array of 8-bit integers
 * @param hex  A hex string to convert
 * @returns An array of 8-bit integers
 */
export const hexStringToArray = (hex: string) => {
  const result = new Uint8Array(hex.length >> 1);
  for (let k = 0; k < result.length; k++) {
    const i = k << 1;
    result[k] = Number.parseInt(hex.substring(i, i + 2), 16);
  }
  return result;
};

/**
 * Convert an array of 8-bit integers to a hex string
 * @param bytes Array of 8-bit integers to convert
 * @returns Hexadecimal representation of the array
 */
export const arrayToHexString = (bytes: Uint8Array) => {
  const res = [];
  for (let c = 0; c < bytes.length; c++) {
    const hex = bytes[c].toString(16);
    res.push(hex.length < 2 ? "0" + hex : hex);
  }
  return res.join("");
};
