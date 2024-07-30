import { ValidationRule } from "./ValidationRule";

interface InputField {
  label: string;
  name: string;
  type: string;
  validation?: ValidationRule;
}

export default InputField;
