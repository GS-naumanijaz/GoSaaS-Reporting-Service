
export abstract class TableData {
  abstract tableData(): string[];
  abstract tableHeadings(): string[];
  abstract getId(): number;
  abstract getTableHeader(): string;
  abstract getColumnWidths(): string[];
  abstract getCheckBoxWidth(): string;
  abstract editRowData(elementIndex: number, newValue: string): void;
  
  requiresStatusToggle(): boolean {
    return false;
  }
  getSwitchStatus(): boolean {
    throw new Error("This componnent does not have a switch");
  }
  setSwitchStatus(status: boolean) {
    throw new Error("This componnent does not have a switch");
  }
  toggleSwitchStatus() {
    throw new Error("This componnent does not have a switch");
  }
  
  
  
}
