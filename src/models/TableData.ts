
export abstract class TableData {
  abstract tableData(): string[];
  abstract tableHeadings(): string[];
  abstract getId(): number;
  abstract getTableHeader(): string;
  requiresStatusToggle(): boolean {
    return false;
  }
  getSwitchStatus(): boolean {
    throw new Error("This componnent does not have a switch");
  }
  toggleSwitchStatus() {
    throw new Error("This componnent does not have a switch");
  }
  
}
