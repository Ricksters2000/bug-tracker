export const getDataFromFormAsObject = <K extends string>(form: FormData, keys: Record<K, string>): Record<K, string | undefined> => {
  const obj: Record<K, string | undefined> = {...keys}
  for (const key in keys) {
    obj[key] = form.get(keys[key])?.toString()
  }
  return obj
}