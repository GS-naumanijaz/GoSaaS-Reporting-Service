import { ValidationRule } from "./ValidationRule";

export interface InputField {
  label: string;
  name: string;
  type: string;
  validation?: ValidationRule;
}

export interface ColumnSortFilterOptions {
  isEnabled: boolean;
  isSortable?: boolean;
  isSearchable?: boolean;
  dropdownFilter?: string[] ;
}