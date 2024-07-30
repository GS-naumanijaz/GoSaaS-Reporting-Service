import { TableData } from "./TableData";

export class TableManager {
  private data: TableData[];
  private isEditing: boolean[];
  private preEditRows: string[][];
  private checkedState: boolean[];
  private allRowsSelected: boolean;
  private isSelectingRows: boolean;

  constructor(data: TableData[]) {
    this.data = data;
    this.isEditing = new Array(this.data.length).fill(false);
    this.preEditRows = new Array(data.length).fill([]);
    this.checkedState = new Array(this.data.length).fill(false);
    this.allRowsSelected = false;
    this.isSelectingRows = false;
  }

  pageSize(): number {
    return this.data.length;
  }

  getTableData(): TableData[] {
    return this.data;
  }

  getCheckedState(): boolean[] {
    return this.checkedState;
  }

  getIsEditing(): boolean[] {
    return this.isEditing;
  }

  getAllRowsSelected(): boolean {
    return this.allRowsSelected;
  }

  getIsSelectingRows(): boolean {
    return this.isSelectingRows;
  }

  getTableHeader(): string {
    return this.data[0].getTableHeader();
  }

  getTableHeadings(): string[] {
    return this.data[0].getTableHeadings();
  }

  getCheckBoxWidth(): string {
    return this.data[0].getCheckBoxWidth();
  }

  getColumnWidths(): string[] {
    return this.data[0].getColumnWidths();
  }

  getInputFields(): string[] {
    return this.data[0].getInputFields();
  }

  getInputType(index: number): string {
    return this.data[0].getInputType()[index];
  }

  getInputFieldTypes(): string[] {
    return this.data[0].getInputType();
  }

  getEditAccess(index: number): boolean {
    return this.data[0].getEditAccess()[index];
  }

  toggleRowEditState(index: number) {
    this.isEditing[index] = !this.isEditing[index];
    if (this.isEditing[index]) {
      this.preEditRows[index] = this.data[index].getTableData();
    }
  }

  handleToggleSwitch(id: number) {
    this.data = this.data.map((row) => {
      if (row.getId() === id) {
        row.toggleSwitchStatus();
      }
      return row;
    });
  }

  handleBulkSwitchActions(newStatus: boolean) {
    this.data = this.data.map((row, index) => {
      if (this.checkedState[index]) {
        row.setSwitchStatus(newStatus);
      }
      return row;
    });
  }

  selectAllCheckBoxes() {
    this.allRowsSelected = !this.allRowsSelected;
    this.checkedState = new Array(this.checkedState.length).fill(this.allRowsSelected);
    this.isSelectingRows = this.allRowsSelected;
  }

  selectCheckBox(rowIndex: number) {
    this.checkedState[rowIndex] = !this.checkedState[rowIndex];
    this.isSelectingRows = this.checkedState.some((element) => element === true);
    this.allRowsSelected = this.checkedState.every((element) => element === true);
  }

  handleEditToggle(index: number) {
    this.toggleRowEditState(index);
  }

  handleInputChange(rowIndex: number, elementIndex: number, value: string) {
    this.data[rowIndex].editRowData(elementIndex, value);
  }

  revertEdit(rowIndex: number) {
    const newRow = this.data.find((item) => item.getId() === this.data[rowIndex].getId());
    if (newRow) this.data[rowIndex].editCompleteRow(this.preEditRows[rowIndex]);
  }

  handleDeleteRow(rowIndex: number) {
    this.data = this.data.filter((_, index) => index !== rowIndex);
    this.checkedState = this.checkedState.filter((_, index) => index !== rowIndex);
    this.isEditing = this.isEditing.filter((_, index) => index !== rowIndex);
  }

  handleBulkDeleteRows() {
    this.data = this.data.filter((_, index) => !this.checkedState[index]);
    this.isEditing = this.isEditing.filter((_, index) => !this.checkedState[index]);
    this.checkedState = new Array(this.data.length).fill(false);
  }
}
