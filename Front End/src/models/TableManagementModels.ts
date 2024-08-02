import { ValidationRule } from "./ValidationRule";

export interface InputField {
  label: string;
  name: string;
  isSelectable: boolean;
  type?: string;
  validation?: ValidationRule;
  options?: string[];
  isHidden?: boolean;
}

export interface ColumnSortFilterOptions {
  isEnabled: boolean;
  isSortable?: boolean;
  isSearchable?: boolean;
  dropdownFilter?: string[];
}
