import throttle from "./throttle";

describe("throttle()", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("invokes function at most once every wait milliseconds", () => {
    const functionToThrottle = vi.fn();
    const wait = 1000;
    const throttledFunction = throttle(functionToThrottle, wait);

    throttledFunction();
    expect(functionToThrottle).toHaveBeenCalledTimes(1);

    // Call function just before the wait time expires
    vi.advanceTimersByTime(wait - 1);
    throttledFunction();
    expect(functionToThrottle).toHaveBeenCalledTimes(1);

    // fast-forward until 1st call should be executed
    vi.advanceTimersByTime(1);
    expect(functionToThrottle).toHaveBeenCalledTimes(2);

    throttledFunction();
    expect(functionToThrottle).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(wait);
    expect(functionToThrottle).toHaveBeenCalledTimes(3);
  });
});
