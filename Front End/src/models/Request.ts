import { report } from "process";
import { ColumnSortFilterOptions, InputField } from "./TableManagementModels";
import { TableRowData } from "./TableRowData";
import { DestinationConnection } from "./DestinationConnection";

export class Request extends TableRowData {
  private id: number;
  private reportName: string;
  private applicationAlias: string;
  private createdBy: string;
  private status: string;
  public reportLink: string;
  private destination: DestinationConnection;

  private static tableHeader = "Request";
  private static tableHeadings = [
    "Name",
    "Application",
    "Creation Time",
    "Status",
    "",
  ];
  private static columnWidths = ["25%", "25%", "25%", "20%", "5%"];

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
      dropdownFilter: ["PASS", "FAIL", "PENDING"],
    },
    {
      isEnabled: false,
    },
  ];

  constructor(
    id: number = 0,
    name: string = "",
    applicationAlias: string = "",
    createdBy: string = "",
    status: string = "",
    reportLink: string = "",
    destination: DestinationConnection = new DestinationConnection(),
  ) {
    super();
    this.id = id;
    this.reportName = name;
    this.applicationAlias = applicationAlias;
    this.createdBy = createdBy;
    this.status = status;
    this.reportLink = reportLink;
    this.destination = destination;
  }

  getId(): number {
    return this.id;
  }
  getReportLink(): string {
    return this.reportLink;
  }
  getDestination(): DestinationConnection {
    return this.destination;
  }

  getTableData(): string[] {
    return [
      this.reportName,
      this.applicationAlias,
      this.createdBy,
      this.status,
    ];
  }
  getTableHeadings(): string[] {
    return Request.tableHeadings;
  }
  getTableHeader(): string {
    return Request.tableHeader;
  }
  getColumnWidths(): string[] {
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
    return [false, false, false, false];
  }

  requiresCheckBox(): boolean {
    return false;
  }

  requiresActions(): boolean {
    return true;
  }

  requiresDownloadButton(): boolean {
    return true;
  }

  requiresDeleteButton(): boolean {
    return false;
  }
}
