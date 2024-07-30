
export abstract class TableData {
  abstract tableData(): string[];
  abstract tableHeadings(): string[];
  abstract getId(): number;
  abstract getTableHeader(): string;
  abstract getColumnWidths(): string[];
  abstract getCheckBoxWidth(): string;
  abstract editRowData(elementIndex: number, newValue: string): void;
  abstract editCompleteRow(newValue: string[]): void;
  abstract getInputType(): string[];
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
