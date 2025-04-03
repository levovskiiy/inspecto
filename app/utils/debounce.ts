export const debounce = (fn: Function, delay = 0) => {
  let timeout: NodeJS.Timeout | undefined;

  return (...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
