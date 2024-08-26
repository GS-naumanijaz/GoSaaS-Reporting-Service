import { Product } from "../components/Dashboard/Products";
import { ColumnSortFilterOptions, InputField } from "./TableManagementModels";
import { TableRowData } from "./TableRowData";

export class TableManager {
  private defaultData: TableRowData;
  private data: TableRowData[];
  private product?: Product;
  private isEditing: boolean[];
  private preEditRows: string[][];
  private checkedState: boolean[];
  private allRowsSelected: boolean;
  private isSelectingRows: boolean;
  private canSaveEditedRows: boolean[];
  private preEditActiveStatus: boolean;

  constructor(dataType: TableRowData, data: TableRowData[], product?: Product) {
    this.defaultData = dataType;
    this.product = product;
    this.data = data;
    this.isEditing = new Array(this.data.length).fill(false);
    this.preEditRows = new Array(data.length).fill([]);
    this.checkedState = new Array(this.data.length).fill(false);
    this.canSaveEditedRows = new Array(this.data.length).fill(false);
    this.allRowsSelected = false;
    this.isSelectingRows = false;
    this.preEditActiveStatus = false;
  }

  pageSize(): number {
    return this.data.length;
  }

  getTableData(): TableRowData[] {
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

  getCanSaveEditedRows(): boolean[] {
    return this.canSaveEditedRows;
  }

  getTableHeader(): string {
    return this.defaultData.getTableHeader();
  }

  getTableProduct(): Product | undefined {
    return this.product;
  }

  getTableHeadings(): string[] {
    return this.defaultData.getTableHeadings();
  }

  getCheckBoxWidth(): string {
    return this.defaultData.getCheckBoxWidth();
  }

  getColumnWidths(): string[] {
    return this.defaultData.getColumnWidths();
  }

  getInputFields(): InputField[] {
    return this.defaultData.getInputFields();
  }

  getSortFilterOptions(): ColumnSortFilterOptions[] {
    return this.defaultData.getSortFilterOptions();
  }

  getEditAccess(index: number): boolean {
    return this.defaultData.getEditAccess()[index];
  }

  getRowId(index: number): number {
    return this.data[index].getId();
  }

  getRowItem(index: number): any {
    return this.data[index];
  }

  getPartialRowItem(index: number): any {
    const differentIndexes: number[] = [];

    for (let i = 0; i < this.preEditRows[index].length; i++) {
      if (this.preEditRows[index][i] !== this.data[index].getTableData()[i]) {
        differentIndexes.push(i);
      }
    }

    let partialData = this.data[index].getPartialData(differentIndexes);

    if (this.requiresStatusToggle() && this.data[index].getSwitchStatus() !== this.preEditActiveStatus) {
      partialData = { ...partialData, isActive: this.data[index].getSwitchStatus()}
    }

    return partialData;
  }

  setEditSaveOnRow(index: number, newValue: boolean) {
    this.canSaveEditedRows[index] = newValue;
  }

  toggleRowEditState(index: number) {
    this.isEditing[index] = !this.isEditing[index];
    if (this.isEditing[index]) {
      this.preEditRows[index] = this.data[index].getTableData();
      this.preEditActiveStatus = this.data[index].getSwitchStatus();
    }
    
  }

  requiresActions() {
    return this.defaultData.requiresActions();
  }

  requiresStatusToggle() {
    return this.defaultData.requiresStatusToggle();
  }

  requiresCheckBox() {
    return this.defaultData.requiresCheckBox();
  }

  requiresTestButton() {
    return this.defaultData.requiresTestButton();
  }

  requiresRedirect(): boolean {
    return this.defaultData.requiresRedirect();
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
    this.checkedState = new Array(this.checkedState.length).fill(
      this.allRowsSelected
    );
    this.isSelectingRows = this.allRowsSelected;
  }

  selectCheckBox(rowIndex: number) {
    this.checkedState[rowIndex] = !this.checkedState[rowIndex];
    this.isSelectingRows = this.checkedState.some(
      (element) => element === true
    );
    this.allRowsSelected = this.checkedState.every(
      (element) => element === true
    );
  }

  handleEditToggle(index: number) {
    this.toggleRowEditState(index);
  }

  handleInputChange(rowIndex: number, elementIndex: number, value: string) {
    this.data[rowIndex].editRowData(elementIndex, value);
  }

  revertEdit(rowIndex: number) {
    const newRow = this.data.find(
      (item) => item.getId() === this.data[rowIndex].getId()
    );
    if (newRow) this.data[rowIndex].editCompleteRow(this.preEditRows[rowIndex]);
  }

  handleDeleteRow(rowIndex: number) {
    this.data = this.data.filter((_, index) => index !== rowIndex);
    this.checkedState = this.checkedState.filter(
      (_, index) => index !== rowIndex
    );
    this.isEditing = this.isEditing.filter((_, index) => index !== rowIndex);
  }

  handleBulkDeleteRows() {
    this.data = this.data.filter((_, index) => !this.checkedState[index]);
    this.isEditing = this.isEditing.filter(
      (_, index) => !this.checkedState[index]
    );
    this.checkedState = new Array(this.data.length).fill(false);
  }

  getCheckedIds(): number[] {
    return this.data
      .map((item, index) => (this.checkedState[index] ? item.getId() : null))
      .filter((id) => id !== null) as number[];
  }
}
