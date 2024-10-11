const ifDefined = <T, R>(cb: (input: T) => R) => {
  return <U extends T | undefined>(input: U) => {
    return (input !== undefined ? cb(input as T) : undefined) as U extends T
      ? R
      : undefined;
  };
};

const encodeUtf8 = ifDefined((input: string) => encodeURIComponent(input));

const decodeUtf8 = ifDefined((input: string) => decodeURIComponent(input));

const encodeBase64 = ifDefined((input: string) => btoa(input).trim());

const decodeBase64 = ifDefined((input: string) => atob(input.trim()));

const encodeUtf8Base64 = ifDefined((input: string) =>
  encodeBase64(encodeUtf8(input)),
);

const decodeUtf8Base64 = ifDefined((input: string) =>
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
const binaryStringToArray = (str: string) => {
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
const arrayToBinaryString = (bytes: Uint8Array) => {
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
const hexStringToArray = (hex: string) => {
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
const arrayToHexString = (bytes: Uint8Array) => {
  const res = [];
  for (let c = 0; c < bytes.length; c++) {
    const hex = bytes[c].toString(16);
    res.push(hex.length < 2 ? "0" + hex : hex);
  }
  return res.join("");
};

/**
 * Convert a native javascript string to a Uint8Array of utf8 bytes
 * @param str - The string to convert
 * @returns A valid squence of utf8 bytes.
 */
const stringToUtf8Array = (str: string): Uint8Array => {
  const encoder = new TextEncoder();

  return encoder.encode(str);
};

/**
 * Convert a Uint8Array of utf8 bytes to a native javascript string
 * @param utf8 - A valid squence of utf8 bytes
 * @returns A native javascript string.
 */
const utf8ArrayToString = (utf8: Uint8Array): string => {
  const decoder = new TextDecoder();

  return decoder.decode(utf8);
};

export {
  arrayToBinaryString,
  arrayToHexString,
  binaryStringToArray,
  decodeBase64,
  decodeUtf8,
  decodeUtf8Base64,
  encodeBase64,
  encodeUtf8,
  encodeUtf8Base64,
  hexStringToArray,
  stringToUtf8Array,
  utf8ArrayToString,
};
