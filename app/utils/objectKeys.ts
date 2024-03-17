export const objectKeys = <K extends string>(obj: Record<K, unknown>, excludeKey?: K): Array<K> => {
  return Object.keys(obj).filter(key => key !== excludeKey) as Array<K>
}

export const objectKeysAndExcludeKey = <K extends Record<string, unknown>, E extends keyof K>(obj: K, excludeKey?: E): Array<keyof Omit<K, E>> => {
  return Object.keys(obj).filter(key => key !== excludeKey) as Array<keyof Omit<K, E>>
}