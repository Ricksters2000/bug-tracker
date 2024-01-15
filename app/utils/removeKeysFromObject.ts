export const removeKeysFromObject = <T extends {}, K extends keyof T>(target: T, keysToRemove: Array<K>): Omit<T, K> => {
  const output: Partial<T> = {};
  (Object.keys(target) as Array<K>).forEach(key => {
    if (!keysToRemove.includes(key)) {
      output[key] = target[key];
    }
  });
  return output as Omit<T, K>;
};