export const objectKeys = <K extends string>(obj: Record<K, unknown>): Array<K> => {
  return Object.keys(obj) as Array<K>
}