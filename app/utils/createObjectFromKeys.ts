export const createNullObjectFromKeys = <K extends string>(keys: Array<K> | Record<K, unknown>): Record<K, null> => {
  if (!Array.isArray(keys)) {
    keys = Object.keys(keys) as Array<K>
  }
  return Object.fromEntries(keys.map(k => [k, null])) as Record<K, null>
}