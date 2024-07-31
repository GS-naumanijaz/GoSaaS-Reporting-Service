import {ColumnSortFilterOptions, InputField} from "./TableManagementModels";

export abstract class TableRowData {
  abstract getTableData(): string[];
  abstract getTableHeadings(): string[];
  abstract getId(): number;
  abstract getTableHeader(): string;
  abstract getColumnWidths(): string[];
  abstract getCheckBoxWidth(): string;
  abstract editRowData(elementIndex: number, newValue: string): void;
  abstract editCompleteRow(newValue: string[]): void;
  abstract getInputFields(): InputField[];
  abstract getSortFilterOptions(): ColumnSortFilterOptions[];
  abstract getEditAccess(): boolean[];
  
  requiresStatusToggle(): boolean {
    return false;
  }
  getSwitchStatus(): boolean {
    throw new Error("This componnent does not have a switch");
  }
  setSwitchStatus(_: boolean) {
    throw new Error("This componnent does not have a switch");
  }
  toggleSwitchStatus() {
    throw new Error("This componnent does not have a switch");
  }
  
  
  
}
