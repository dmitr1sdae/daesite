let current = 0;

const generateUID = (prefix?: string) => `${prefix || "id"}_${current++}`;

export default generateUID;
