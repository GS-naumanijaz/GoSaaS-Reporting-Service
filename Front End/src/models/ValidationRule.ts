export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customErrorMessage?: string;
}

export const validateField = (value: string, validation?: ValidationRule): string => {
  if (!validation) return "";

  if (validation.required && !value) {
    return "This field is required";
  }
  if (validation.required && validation.minLength && value.length < validation.minLength) {
    return `Minimum length is ${validation.minLength}`;
  }
  if (validation.required && validation.maxLength && value.length > validation.maxLength) {
    return `Maximum length is ${validation.maxLength}`;
  }
  if (validation.required && validation.pattern && !validation.pattern.test(value)) {
    return validation.customErrorMessage || "Invalid format";
  }
  return "";
};