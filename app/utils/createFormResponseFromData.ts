import {FormErrors, FormResponse} from "~/types/Response";
import {createNullObjectFromKeys} from "./createObjectFromKeys";

export const createFormResponseFromData = <K extends string>(data: Record<K, string | undefined>): FormResponse<K> => {
  let hasErrors = false
  const errors: FormErrors<K>  = createNullObjectFromKeys(data)
  for (const key in data) {
    if (!data[key]) {
      errors[key] = `Required to have a value for ${key}`
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