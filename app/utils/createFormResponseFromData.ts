import {FormErrors, FormResponse} from "~/types/Response";
import {createNullObjectFromKeys} from "./createObjectFromKeys";

export const createFormResponseFromData = <K extends string>(data: Record<K, string | undefined>, requiredKeys: Array<K>): FormResponse<K> => {
  let hasErrors = false
  const errors: FormErrors<K>  = createNullObjectFromKeys(data)
  for (const key of requiredKeys) {
    if (!data[key]) {
      errors[key] = `${key} is required`
      hasErrors = true
    }
  }
  if (hasErrors) {
    return {
      success: false,
      errors,
    }
  }
  return {
    success: true,
  }
}