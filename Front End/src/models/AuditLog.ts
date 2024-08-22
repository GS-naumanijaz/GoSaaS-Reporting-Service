import { ProductTable } from "./ProductTable";
import { ColumnSortFilterOptions, InputField } from "./TableManagementModels";
import { TableRowData } from "./TableRowData";

export class AuditLog extends TableRowData {
  private id: number;
  private module: string;
  private action: string;
  private createdAt: string;
  private details: string;
  private userId: number;

  private static tableHeader = "Audit Log";
  private static tableHeadings = [
    "User",
    "Module",
    "Action",
    "Details",
    "Created at",
  ]
  private static columnWidths = ["15%", "15%", "15%", "15%", "40%"];

  private static inputFields: InputField[] = [
    {
      name: "dummy",
      label: "dummy",
      isSelectable: false,
      type: "text",
      validation: {
        required: false,
      },
    },
    {
      name: "dummy",
      label: "dummy",
      isSelectable: false,
      type: "text",
      validation: {
        required: false,
      },
    },
    {
      name: "dummy",
      label: "dummy",
      isSelectable: false,
      type: "text",
      validation: {
        required: false,
      },
    },
    {
      name: "dummy",
      label: "dummy",
      isSelectable: false,
      type: "text",
      validation: {
        required: false,
      },
    },
    {
      name: "dummy",
      label: "dummy",
      isSelectable: false,
      type: "text",
      validation: {
        required: false,
      },
    },
    
  ];


  private static sortFilterOptions: ColumnSortFilterOptions[] = [
    {
      isEnabled: true,
      isSearchable: true,
      isSortable: true,
    },
    {
      isEnabled: true,
      dropdownFilter: ["USER", "APPLICATION", "DESTINATION", "SOURCE", "REPORT"],
    },
    {
      isEnabled: true,
      dropdownFilter: ["CREATED", "MODIFIED", "DELETED", "LOGIN", "LOGOUT"],
    },
    {
      isEnabled: true,
      isSearchable: true,
      isSortable: true,
    },
    {
      isEnabled: true,
      isSortable: true,
      DateItem: true,
    },
  ]

  constructor(
    id: number = 0,
    module: string = "",
    action: string = "",
    createdAt: string = "",
    details: string = "",
    userId: number = 0
  ) {
    super();
    this.id = id;
    this.module = module;
    this.action = action;
    this.createdAt = createdAt;
    this.details = details;
    this.userId = userId;
  }

  getId(): number {
    return this.id;
  }
  getTableData(): string[] {
    return [String(this.userId), this.module, this.action, this.details, this.createdAt];
  }
  getTableHeadings(): string[] {
    return AuditLog.tableHeadings;
  }
  getTableHeader(): string {
    return AuditLog.tableHeader;
  }
  getColumnWidths(): string[] {
    return AuditLog.columnWidths;
  }
  editRowData(elementIndex: number, newValue: string): void {
    console.log("cannot edit rows in audit log");
  }
  editCompleteRow(newValue: string[]): void {
    console.log("cannot edit rows in audit log");
  }
  getInputFields(): InputField[] {
    return AuditLog.inputFields;
  }
  getSortFilterOptions(): ColumnSortFilterOptions[] {
    return AuditLog.sortFilterOptions;
  }
  getEditAccess(): boolean[] {
    return [false, false, false, false, false];
  }

  requiresCheckBox(): boolean {
    return false;
  }

  requiresActions(): boolean {
    return false;
  }
  

}