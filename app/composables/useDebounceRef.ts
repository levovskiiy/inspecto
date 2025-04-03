import { debounce } from "~/utils";

export function useDebouncedRef<T>(value: T, delay = 200) {
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set: debounce((newValue: T) => {
        value = newValue;
        trigger();
      }, delay),
    };
  });
}
