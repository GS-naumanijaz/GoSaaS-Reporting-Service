import { Product } from "../components/Dashboard/Products";
import { ColumnSortFilterOptions, InputField } from "./TableManagementModels";
import { TableRowData } from "./TableRowData";

export class ProductTable extends TableRowData {
  private productId: number;
  private alias: string;
  private description: string;
  private isActive: boolean;
  private isDeleted: boolean;
  private creationDate: string;
  private updatedAt: string;
  private deletedBy?: string | null;
  private deletionDate?: string | null;

  // Static variables
  private static tableHeader = "Applications";
  private static tableHeadings = [
    "",
    "Alias",
    "Description",
    "Creation Date",
    "Last Modified",
    "Active Status",
    "Delete",
  ];
  private static columnWidths = ["5%", "20%", "25%", "20%", "20%", "5%", "5%"];

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
      name: "Description",
      label: "description",
      isSelectable: false,
      type: "text",
      validation: {
        required: true,
        minLength: 3,
        maxLength: 100,
        customErrorMessage: "Description must be 3-100 characters long.",
      },
    },
    {
      name: "Creation Date",
      label: "creationDate",
      isSelectable: false,
      type: "date",
      isDate: true,
      validation: {
        required: true,
        customErrorMessage: "Please provide a valid date for Creation Date.",
      },
    },
    {
      name: "Last Modified",
      label: "updatedAt",
      isSelectable: false,
      type: "date",
      isDate: true,
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
    },
    {
      isEnabled: true,
      isSortable: true,
    },
    {
      isEnabled: true,
      isSortable: true,
    },
    {
      isEnabled: true,
      isSortable: true,
    },
    {
      isEnabled: false,
    },
  ];

  constructor(
    productId: number = 0,
    alias: string = "",
    description: string = "",
    isActive: boolean = false,
    isDeleted: boolean = false,
    creationDate: string = "",
    updatedAt: string = "",
    deletedBy?: string | null,
    deletionDate?: string | null
  ) {
    super();
    this.productId = productId;
    this.alias = alias;
    this.description = description;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
    this.creationDate = creationDate;
    this.updatedAt = updatedAt;
    this.deletedBy = deletedBy;
    this.deletionDate = deletionDate;
  }

  getId(): number {
    return this.productId;
  }

  getAlias(): string {
    return this.alias;
  }

  getTableData(): string[] {
    return [this.alias, this.description, this.creationDate, this.updatedAt];
  }

  getProductData(): Product {
    return {
      id: this.productId,
      alias: this.alias,
      description: this.description,
      isActive: this.isActive,
      isDeleted: this.isDeleted,
      creationDate: this.creationDate,
      updatedAt: this.updatedAt,
      deletedBy: this.deletedBy,
      deletionDate: this.deletionDate,
    };
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
        this.description = newValue;
        break;
      case 2:
        this.creationDate = newValue;
        break;
      case 3:
        this.updatedAt = newValue;
        break;
    }
  }

  editCompleteRow(newValue: string[]) {
    this.alias = newValue[0];
    this.description = newValue[1];
    this.creationDate = newValue[2];
    this.updatedAt = newValue[3];
  }

  getInputFields(): InputField[] {
    return ProductTable.inputFields;
  }

  getSortFilterOptions(): ColumnSortFilterOptions[] {
    return ProductTable.sortFilterOptions;
  }

  getEditAccess(): boolean[] {
    return [true, true, true, true];
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

  requiresRedirect(): boolean {
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
