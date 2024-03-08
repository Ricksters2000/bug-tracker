import {isNullOrUndefined} from "./inNullOrUndefined";

export function isNotNullOrUndefined<T>(input: null | undefined | T): input is T {
  return !isNullOrUndefined(input);
}