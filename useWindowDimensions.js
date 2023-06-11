export function useWindowDimensions() {
  const hasWindow = typeof window !== "undefined";

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = hasWindow
      ? window
      : null;
    return {
      width,
      height,
    };
  }

  return getWindowDimensions();
}
