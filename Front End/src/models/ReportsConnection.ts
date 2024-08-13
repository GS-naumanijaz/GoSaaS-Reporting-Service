import { Application } from "../components/ApplicationPage/AppDashboard";
import { ColumnSortFilterOptions, InputField } from "./TableManagementModels";
import { TableRowData } from "./TableRowData";

export class ReportsConnection extends TableRowData {
  private reportId: number;
  private alias: string;
  private description: string;
  private connection_alias: string;
  private destination_alias: string;
  private stored_procedures: string;
  private parameters: string;
  // private appId: number;
  private application: Application;

  //Static variables
  private static tableHeader = "Reports";
  private static tableHeadings = [
    "",
    "Alias",
    "Description",
    "Connection",
    "Destination",
    "Stored Procedures",
    "Parameters",
    "Edit",
    "Delete",
  ];
  private static columnWidths = [
    "5%",
    "25%",
    "15%",
    "15%",
    "10%",
    "15%",
    "10%",
    "5%",
  ];

  private static inputFields: InputField[] = [
    {
      name: "Alias",
      label: "alias",
      isSelectable: false,
      type: "text",
      validation: { required: true, minLength: 2, maxLength: 20 },
    },
    {
      name: "Description",
      label: "description",
      isSelectable: false,
      type: "text",
      validation: { required: true },
    },
    {
      name: "Connection",
      label: "connection",
      isSelectable: true,
      options: ["Test 1", "Get", "From", "Database"],
    },
    {
      name: "Destination",
      label: "destination",
      isSelectable: true,
      options: ["Test 2", "Get", "From", "Database"],
    },
    {
      name: "Stored Procedures",
      label: "stored_pocedures",
      isSelectable: true,
      options: ["Test 3", "Get", "From", "Database"],
    },
    {
      name: "Parameters",
      label: "parameters",
      isSelectable: true,
      options: ["Test 2", "Get", "From", "Database"],
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
      dropdownFilter: ["Test 1", "Get", "From", "Database"],
    },
    {
      isEnabled: true,
      dropdownFilter: ["Test 2", "Get", "From", "Database"],
    },
    {
      isEnabled: true,
      dropdownFilter: ["Test 3", "Get", "From", "Database"],
    },
    {
      isEnabled: true,
      dropdownFilter: ["Test 4", "Get", "From", "Database"],
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
    stored_procedures: string = "",
    parameters: string = "",
    // appId: number,
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
    }
  ) {
    super();
    this.reportId = reportId;
    this.alias = alias;
    this.description = description;
    this.connection_alias = connection_alias;
    this.destination_alias = destination_alias;
    this.stored_procedures = stored_procedures;
    this.parameters = parameters;
    // this.appId = appId;
    this.application = application;
  }

  getId(): number {
    return this.reportId;
  }

  getTableData(): string[] {
    return [
      this.alias,
      this.description,
      this.connection_alias,
      this.destination_alias,
      this.stored_procedures,
      this.parameters,
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

  editRowData(elementIndex: number, newValue: string): void {
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
        this.stored_procedures = newValue;
        break;
      case 5:
        this.parameters = newValue;
        break;
    }
  }

  editCompleteRow(newValue: string[]) {
    this.alias = newValue[0];
    this.description = newValue[1];
    this.connection_alias = newValue[2];
    this.destination_alias = newValue[3];
    this.stored_procedures = newValue[4];
    this.parameters = newValue[5];
  }

  getInputFields(): InputField[] {
    return ReportsConnection.inputFields;
  }

  getSortFilterOptions(): ColumnSortFilterOptions[] {
    return ReportsConnection.sortFilterOptions;
  }

  getEditAccess(): boolean[] {
    return [true, true, true, true, true];
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

  getApplication(): Application {
    return this.application;
  }
}
