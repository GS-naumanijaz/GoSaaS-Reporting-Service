import { ColumnSortFilterOptions, InputField } from "./TableManagementModels";
import { TableRowData } from "./TableRowData";

export class ProductTable extends TableRowData {
  private productId: number;
  private alias: string;
  private updatedAt: string;
  private isActive: boolean;

  //Static variables
  private static tableHeader = "Applications";
  private static tableHeadings = [
    "",
    "Alias",
    "Last Modified",
    "Active Status",
    "Edit",
    "Delete",
  ];
  private static columnWidths = ["5%", "20%", "40%", "20%", "5%", "5%", "5%"];

  private static inputFields: InputField[] = [
    {
      name: "Alias",
      label: "alias",
      isSelectable: false,
      type: "text",
      validation: {
        required: true,
        minLength: 3,
        maxLength: 20,
        pattern: /^[a-zA-Z0-9 _-]+$/,
        customErrorMessage:
          "Alias must be 3-20 characters long and contain only letters, numbers, spaces, underscores, or hyphens.",
      },
    },
    {
      name: "Last Modified",
      label: "updatedAt",
      isSelectable: false,
      type: "date",
      validation: {
        required: true,
        customErrorMessage: "Please provide a valid date for Last Modified.",
      },
    },
  ];

  private static sortFilterOptions: ColumnSortFilterOptions[] = [
    {
      isEnabled: true,
      isSortable: true,
      isSearchable: true,
    },
    {
      isEnabled: true,
      isSortable: true,
      isSearchable: true,
    },
    {
      isEnabled: true,
      dropdownFilter: ["All", "Active", "Inactive"],
    },
    {
      isEnabled: false,
    },
    {
      isEnabled: false,
    },
  ];

  constructor(
    productId: number = 0,
    alias: string = "",
    updatedAt: string = "",
    isActive: boolean = false
  ) {
    super();
    this.productId = productId;
    this.alias = alias;
    this.updatedAt = updatedAt;
    this.isActive = isActive;
  }

  getId(): number {
    return this.productId;
  }

  getAlias(): string {
    return this.alias;
  }

  getTableData(): string[] {
    return [this.alias, this.updatedAt];
  }

  getTableHeadings(): string[] {
    return ProductTable.tableHeadings.slice(1);
  }

  getTableHeader(): string {
    return ProductTable.tableHeader;
  }

  getColumnWidths(): string[] {
    return ProductTable.columnWidths.slice(1);
  }

  editRowData(elementIndex: number, newValue: string): void {
    switch (elementIndex) {
      case 0:
        this.alias = newValue;
        break;
      case 1:
        this.updatedAt = newValue;
        break;
    }
  }

  editCompleteRow(newValue: string[]) {
    this.alias = newValue[0];
    this.updatedAt = newValue[1];
  }

  getInputFields(): InputField[] {
    return ProductTable.inputFields;
  }

  getSortFilterOptions(): ColumnSortFilterOptions[] {
    return ProductTable.sortFilterOptions;
  }

  getEditAccess(): boolean[] {
    return [true, true];
  }

  requiresCheckBox(): boolean {
    return true;
  }

  getCheckBoxWidth(): string {
    return ProductTable.columnWidths[0];
  }

  requiresStatusToggle(): boolean {
    return true;
  }

  getSwitchStatus(): boolean {
    return this.isActive;
  }

  setSwitchStatus(status: boolean): void {
    this.isActive = status;
  }

  toggleSwitchStatus() {
    this.isActive = !this.isActive;
  }
}
