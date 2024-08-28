import { ColumnSortFilterOptions, InputField } from "./TableManagementModels";
import { TableRowData } from "./TableRowData";


export class Request extends TableRowData {
  private id: number;
  private name: string;
  private applicationAlias: string;
  private createdAt: string;
  private createdBy: string;
  private issues: string;
  private status: string;

  private static tableHeader = "Request";
  private static tableHeadings = [
    "Name",
    "Application",
    "Creation Time",
    "Created By",
    "Issues",
    "Status"
  ]
  private static columnWidths = ["20%", "20%", "15%", "15%", "15%", "15%"];

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
      isSearchable: true,
      isSortable: true,
    },
    {
      isEnabled: true,
      isSortable: true,
      DateItem: true,
    },
    {
      isEnabled: true,
      isSearchable: true,
      isSortable: true,
    },
    {
      isEnabled: true,
      isSearchable: true,
      isSortable: true,
    },
    {
      isEnabled: true,
      dropdownFilter: ["PASS", "FAIL", "PENDING"],
    },
  ]

  constructor(
    id: number = 0,
    name: string = "",
    applicationAlias: string = "",
    createdAt: string = "",
    createdBy: string = "",
    issues: string = "",
    status: string = "",
  ) {
    super();
    this.id = id;
    this.name = name;
    this.applicationAlias = applicationAlias;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.issues = issues;
    this.status = status
  }

  getId(): number {
    return this.id;
  }
  getTableData(): string[] {
    return [this.name, this.applicationAlias, this.createdAt, this.createdBy, this.issues, this.status];
  }
  getTableHeadings(): string[] {
    return Request.tableHeadings;
  }
  getTableHeader(): string {
    return Request.tableHeader;
  }
  getColumnWidths(): string [] {
    return Request.columnWidths;
  }
  editRowData(_: number, __: string): void {
    console.log("cannot edit rows in audit log");
  }
  editCompleteRow(_: string[]): void {
    console.log("cannot edit rows in audit log");
  }
  getInputFields(): InputField[] {
    return Request.inputFields;
  }
  getSortFilterOptions(): ColumnSortFilterOptions[] {
    return Request.sortFilterOptions;
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