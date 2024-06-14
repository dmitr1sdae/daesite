import generateUID from "./generateUID";

describe("generateUID()", () => {
  it("single call without prefix", () => {
    const result = generateUID();

    expect(result).toBe("id_0");
  });

  it("single call with prefix", () => {
    const result = generateUID("test");

    expect(result).toBe("test_1");
  });
});
