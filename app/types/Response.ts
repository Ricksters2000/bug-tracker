export type FormErrors<K extends string> = Record<K, string>

export type FormResponse<K extends string> = {
  success: true;
} | {
  success: false;
  errors: FormErrors<K>;
}