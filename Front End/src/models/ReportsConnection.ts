import { Application } from "../components/ApplicationPage/AppDashboard";
import { DestinationConnection } from "./DestinationConnection";
import { SourceConnection } from "./SourceConnection";
import { ColumnSortFilterOptions, InputField } from "./TableManagementModels";
import { TableRowData } from "./TableRowData";

export class ReportsConnection extends TableRowData {
  private reportId: number;
  public alias: string;
  public description: string;
  private connection_alias: string;
  private destination_alias: string;
  private sourceConnection?: SourceConnection;
  private destinationConnection?: DestinationConnection;
  public storedProcedure: string;
  public params: string[];
  public application: Application;
  public isActive: boolean;
  public isPinned: boolean;
  public xslTemplate: string;

  //Static variables
  private static tableHeader = "Reports";
  private static tableHeadings = [
    "",
    "Alias",
    "Description",
    "Connection",
    "Destination",
    "Stored Procedures",
    "Active Status",
    "Edit",
    "Delete",
  ];
  private static columnWidths = [
    "5%",
    "25%",
    "15%",
    "10%",
    "10%",
    "10%",
    "10%",
    "10%",
    "5%",
  ];

  //not being used
  private static inputFields: InputField[] = [
    {
      name: "Alias",
      label: "alias",
      isSelectable: false,
      type: "text",
      validation: {
        required: true,
        minLength: 2,
        maxLength: 20,
        pattern: /^[a-zA-Z0-9 _-]+$/,
        customErrorMessage:
          "Alias must be 2-20 characters long and contain only letters, numbers, spaces, underscores, or hyphens.",
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
        maxLength: 255,
        pattern: /^[a-zA-Z0-9 _-]+$/,
        customErrorMessage:
          "Description is required and must be at least 3 characters long.",
      },
    },
    {
      name: "Connection",
      label: "connection",
      isSelectable: false,
      type: "text",
      validation: {
        required: true,
        minLength: 3,
        maxLength: 50,
        pattern: /^[a-zA-Z0-9 _-]+$/,
        customErrorMessage:
          "Connection must be 3-50 characters long and contain only letters, numbers, spaces, underscores, or hyphens.",
      },
    },
    {
      name: "Destination",
      label: "destination",
      isSelectable: false,
      type: "text",
      validation: {
        required: true,
        minLength: 3,
        maxLength: 50,
        pattern: /^[a-zA-Z0-9 _-]+$/,
        customErrorMessage:
          "Destination must be 3-50 characters long and contain only letters, numbers, spaces, underscores, or hyphens.",
      },
    },
    {
      name: "Stored Procedures",
      label: "stored_procedures",
      isSelectable: false,
      type: "text",
      validation: {
        required: true,
        minLength: 3,
        maxLength: 100,
        pattern: /^[a-zA-Z0-9 _-]+$/,
        customErrorMessage:
          "Stored Procedures must be 3-100 characters long and contain only letters, numbers, spaces, underscores, or hyphens.",
      },
    },
    {
      name: "Parameters",
      label: "parameters",
      isSelectable: false,
      type: "text",
      validation: {
        required: true,
        minLength: 3,
        maxLength: 100,
        pattern: /^[a-zA-Z0-9 _-]+$/,
        customErrorMessage:
          "Parameters must be 3-100 characters long and contain only letters, numbers, spaces, underscores, or hyphens.",
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
    reportId: number = 0,
    alias: string = "",
    description: string = "",
    connection_alias: string = "",
    destination_alias: string = "",
    sourceConnection?: SourceConnection,
    destinationConnection?: DestinationConnection,
    stored_procedures: string = "",
    parameters: string[] = [],
    application: Application = {
      id: 0,
      alias: "",
      description: "",
      isActive: false,
      isDeleted: false,
      createdBy: "",
      deletedBy: "",
      creationDate: "",
      deletionDate: null,
      updatedAt: "",
    },
    isActive: boolean = false,
    isPinned: boolean = false,
    xslTemplate: string = ""
  ) {
    super();
    this.reportId = reportId;
    this.alias = alias;
    this.description = description;
    this.connection_alias = connection_alias;
    this.destination_alias = destination_alias;
    this.sourceConnection = sourceConnection;
    this.destinationConnection = destinationConnection;
    this.storedProcedure = stored_procedures;
    this.params = parameters;
    this.application = application;
    this.isActive = isActive;
    this.isPinned = isPinned;
    this.xslTemplate = xslTemplate;
  }

  getId(): number {
    return this.reportId;
  }

  getAlias(): string {
    return this.alias;
  }

  getDescription(): string {
    return this.description;
  }

  getConnectionAlias(): string {
    return this.connection_alias;
  }

  getDestinationAlias(): string {
    return this.destination_alias;
  }

  getSourceConnection(): SourceConnection {
    return this.sourceConnection!;
  }

  getDestinationConnection(): DestinationConnection {
    return this.destinationConnection!;
  }

  getStoredProcedures(): string {
    return this.storedProcedure;
  }

  getParameters(): string[] {
    return this.params;
  }

  getTableData(): string[] {
    return [
      this.alias,
      this.description,
      this.connection_alias,
      this.destination_alias,
      this.storedProcedure,
    ];
  }

  getTableHeadings(): string[] {
    return ReportsConnection.tableHeadings.slice(1);
  }

  getTableHeader(): string {
    return ReportsConnection.tableHeader;
  }

  getColumnWidths(): string[] {
    return ReportsConnection.columnWidths.slice(1);
  }

  editRowData(elementIndex: number, newValue: any): void {
    switch (elementIndex) {
      case 0:
        this.alias = newValue;
        break;
      case 1:
        this.description = newValue;
        break;
      case 2:
        this.connection_alias = newValue;
        break;
      case 3:
        this.destination_alias = newValue;
        break;
      case 4:
        this.storedProcedure = newValue;
        break;
      case 5:
        this.params = newValue;
        break;
    }
  }

  editCompleteRow(newValue: any[]) {
    this.alias = newValue[0];
    this.description = newValue[1];
    this.connection_alias = newValue[2];
    this.destination_alias = newValue[3];
    this.storedProcedure = newValue[4];
  }

  getInputFields(): InputField[] {
    return ReportsConnection.inputFields;
  }

  getSortFilterOptions(): ColumnSortFilterOptions[] {
    return ReportsConnection.sortFilterOptions;
  }

  getEditAccess(): boolean[] {
    return [false, false, false, false, false];
  }

  requiresCheckBox(): boolean {
    return true;
  }

  getCheckBoxWidth(): string {
    return ReportsConnection.columnWidths[0];
  }

  requiresStatusToggle(): boolean {
    return true;
  }

  getSwitchStatus(): boolean {
    return this.isActive;
  }
  setSwitchStatus(status: boolean) {
    this.isActive = status;
  }
  toggleSwitchStatus() {
    this.isActive = !this.isActive;
  }

  requiresRedirect(): boolean {
    return false;
  }

  getApplication(): Application {
    return this.application;
  }
}
