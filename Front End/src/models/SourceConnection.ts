import { ColumnSortFilterOptions, InputField } from "./TableManagementModels";
import { TableRowData } from "./TableRowData";
import { Application } from "../components/ApplicationPage/AppDashboard";

export class SourceConnection extends TableRowData {
  private connectionId: number;
  private alias: string;
  private connection_type: string;
  private host: string;
  private port: string;
  private database_name: string;
  private username: string;
  private password: string;
  // private appId: number;
  private application: Application;
  private isActive: boolean;

  //Static variables
  private static tableHeader = "Source Connections";
  private static tableHeadings = [
    "",
    "Alias",
    "Connection Type",
    "Database Name",
    "Host",
    "Port",
    "Username",
    "Password",
    "Active Status",
    "Edit",
    "Delete",
    "",
  ];
  private static columnWidths = [
    "2.5%",
    "12.5%",
    "12.5%",
    "10%",
    "10%",
    "10%",
    "10%",
    "12.5%",
    "5%",
    "5%",
    "5%",
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
      name: "Connection Type",
      label: "connection type",
      isSelectable: true,
      options: ["SQL", "NoSQL"],
    },
    {
      name: "Database Name",
      label: "database name",
      isSelectable: false,
      type: "text",
      validation: { required: true },
    },
    {
      name: "Host",
      label: "host",
      isSelectable: false,
      type: "text",
      validation: { required: true },
    },
    {
      name: "Port",
      label: "port",
      isSelectable: false,
      type: "text",
      validation: { required: true },
    },
    {
      name: "Username",
      label: "username",
      isSelectable: false,
      type: "text",
      validation: { required: true },
    },
    {
      name: "Password",
      label: "password",
      isSelectable: false,
      isHidden: true,
      type: "text",
      validation: { required: true },
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
      dropdownFilter: ["SQL", "NoSQL"],
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
      isEnabled: false,
    },
    {
      isEnabled: true,
      dropdownFilter: ["Active", "Inactive"],
    },
    {
      isEnabled: false,
    },
    {
      isEnabled: false,
    },
    {
      isEnabled: false,
    },
  ];

  constructor(
    connectionId: number = 0,
    alias: string = "",
    connection_type: string = "",
    database_name: string = "",
    host: string = "",
    port: string = "",
    username: string = "",
    password: string = "",
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
    isActive: boolean = false
  ) {
    super();
    this.connectionId = connectionId;
    this.alias = alias;
    this.connection_type = connection_type;
    this.host = host;
    this.port = port;
    this.database_name = database_name;
    this.username = username;
    this.password = password;
    // this.appId = appId;
    this.isActive = isActive;
    this.application = application;
  }

  getId(): number {
    return this.connectionId;
  }

  getTableData(): string[] {
    return [
      this.alias,
      this.connection_type,
      this.database_name,
      this.host,
      this.port,
      this.username,
      this.password,
    ];
  }

  getTableHeadings(): string[] {
    return SourceConnection.tableHeadings.slice(1);
  }

  getTableHeader(): string {
    return SourceConnection.tableHeader;
  }

  getColumnWidths(): string[] {
    return SourceConnection.columnWidths.slice(1);
  }

  editRowData(elementIndex: number, newValue: string): void {
    switch (elementIndex) {
      case 0:
        this.alias = newValue;
        break;
      case 1:
        this.connection_type = newValue;
        break;
      case 2:
        this.host = newValue;
        break;
      case 3:
        this.port = newValue;
        break;
      case 4:
        this.connection_type = newValue;
        break;
      case 5:
        this.host = newValue;
        break;
      case 6:
        this.port = newValue;
        break;
    }
  }

  editCompleteRow(newValue: string[]) {
    this.alias = newValue[0];
    this.connection_type = newValue[1];
    this.database_name = newValue[2];
    this.host = newValue[3];
    this.port = newValue[4];
    this.username = newValue[5];
    this.password = newValue[6];
  }

  getInputFields(): InputField[] {
    return SourceConnection.inputFields;
  }

  getSortFilterOptions(): ColumnSortFilterOptions[] {
    return SourceConnection.sortFilterOptions;
  }

  getEditAccess(): boolean[] {
    return [true, true, true, true, true, true, true];
  }

  requiresCheckBox(): boolean {
    return true;
  }

  getCheckBoxWidth(): string {
    return SourceConnection.columnWidths[0];
  }

  requiresStatusToggle(): boolean {
    return true;
  }

  requiresTestButton(): boolean {
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

  getApplication(): Application {
    return this.application;
  }
}
