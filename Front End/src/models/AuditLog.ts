import { ColumnSortFilterOptions, InputField } from "./TableManagementModels";
import { TableRowData } from "./TableRowData";

export class AuditLog extends TableRowData {
  private id: number;
  private module: string;
  private action: string;
  private createdAt: string;
  private details: string;
  private username: string;

  private static tableHeader = "Audit Log";
  private static tableHeadings = [
    "User",
    "Module",
    "Action",
    "Details",
    "Created at",
  ];
  private static columnWidths = ["15%", "15%", "15%", "15%", "40%"];

  private static inputFields: InputField[] = [
    {
      name: "User",
      label: "user",
      isSelectable: false,
      type: "text",
      validation: {
        required: false,
      },
    },
    {
      name: "Module",
      label: "module",
      isSelectable: false,
      type: "text",
      validation: {
        required: false,
      },
    },
    {
      name: "Action",
      label: "action",
      isSelectable: false,
      type: "text",
      validation: {
        required: false,
      },
    },
    {
      name: "Details",
      label: "details",
      isSelectable: false,
      type: "text",
      validation: {
        required: false,
      },
    },
    {
      name: "Created at",
      label: "createdAt",
      isSelectable: false,
      type: "date",
      isDate: true,
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
      dropdownFilter: [
        "All",
        "USER",
        "APPLICATION",
        "DESTINATION",
        "SOURCE",
        "REPORT",
      ],
    },
    {
      isEnabled: true,
      dropdownFilter: [
        "All",
        "CREATED",
        "MODIFIED",
        "DELETED",
        "LOGIN",
        "LOGOUT",
      ],
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
  ];

  constructor(
    id: number = 0,
    module: string = "",
    action: string = "",
    createdAt: string = "",
    details: string = "",
    username: string = ""
  ) {
    super();
    this.id = id;
    this.module = module;
    this.action = action;
    this.createdAt = createdAt;
    this.details = details;
    this.username = username;
  }

  getId(): number {
    return this.id;
  }
  getTableData(): string[] {
    return [
      this.username,
      this.module,
      this.action,
      this.details,
      this.createdAt,
    ];
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
  editRowData(_: number, __: string): void {
    console.log("cannot edit rows in audit log");
  }
  editCompleteRow(_: string[]): void {
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
