export function isNullOrUndefined<T>(input: null | undefined | T): input is null | undefined {
  return input === null || input === undefined;
}
