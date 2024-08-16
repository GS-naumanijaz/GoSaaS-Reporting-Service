import { ColumnSortFilterOptions, InputField } from "./TableManagementModels";
import { TableRowData } from "./TableRowData";
import { Application } from "../components/ApplicationPage/AppDashboard";

export class SourceConnection extends TableRowData {
  private connectionId: number;
  public  alias: string;
  private type: string;
  private host: string;
  private port: string;
  private databaseName: string;
  private username: string;
  private password: string;
  // private appId: number;
  private application: Application;
  private isActive: boolean;

  private static dbTypes = ["SQL", "POSTGRES", "MYSQL", "MARIADB", "ORACLE", "SQLSERVER", "SQLITE", "H2", "DB2", "DERBY", "HSQLDB", "FIREBIRD", "CASSANDRA", "MONGO", "INFORMIX", "SYBASE", "AWSATHENA", "NEO4J", "SNOWFLAKE", "REDSHIFT", "PRESTO"];

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
      name: "Connection Type",
      label: "connection type",
      isSelectable: true,
      options: this.dbTypes,
      validation: {
        required: true,
        customErrorMessage: "Connection type is required.",
      },
    },
    {
      name: "Database Name",
      label: "database name",
      isSelectable: false,
      type: "text",
      validation: {
        required: true,
        minLength: 3,
        maxLength: 50,
        pattern: /^[a-zA-Z0-9 _-]+$/,
        customErrorMessage:
          "Database Name must be 3-50 characters long and contain only letters, numbers, spaces, underscores, or hyphens.",
      },
    },
    {
      name: "Host",
      label: "host",
      isSelectable: false,
      type: "text",
      validation: {
        required: true,
        minLength: 4,
        maxLength: 255,
        pattern: /^[a-zA-Z0-9 .-]+$/,
        customErrorMessage:
          "Host must be 4-255 characters long and contain only letters, numbers, dots, spaces, or hyphens.",
      },
    },
    {
      name: "Port",
      label: "port",
      isSelectable: false,
      type: "text",
      validation: {
        required: true,
        pattern: /^[0-9]+$/,
        customErrorMessage: "Port must contain only numbers.",
      },
    },
    {
      name: "Username",
      label: "username",
      isSelectable: false,
      type: "text",
      validation: {
        required: true,
        minLength: 3,
        maxLength: 30,
        pattern: /^[a-zA-Z0-9 ._-]+$/,
        customErrorMessage:
          "Username must be 3-30 characters long and contain only letters, numbers, spaces, dots, underscores, or hyphens.",
      },
    },
    {
      name: "Password",
      label: "password",
      isSelectable: false,
      isHidden: false,
      type: "text",
      validation: {
        required: true,
        minLength: 8,
        maxLength: 100,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/,
        customErrorMessage:
          "Password must be 8-100 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
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
      dropdownFilter: this.dbTypes,
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
      dropdownFilter: ["All", "Active", "Inactive"],
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
    this.type = connection_type;
    this.host = host;
    this.port = port;
    this.databaseName = database_name;
    this.username = username;
    this.password = password;
    // this.appId = appId;
    this.isActive = isActive;
    this.application = application;
  }

  getId(): number {
    return this.connectionId;
  }

  getAlias(): string {
    return this.alias;
  }

  getType(): string {
    return this.type;
  }

  getHost(): string {
    return this.host;
  }

  getPort(): string {
    return this.port;
  }

  getDatabaseName(): string {
    return this.databaseName;
  }

  getUsername(): string {
    return this.databaseName;
  }

  getPassword(): string {
    return this.password;
  }

  getTableData(): string[] {
    return [
      this.alias,
      this.type,
      this.databaseName,
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
        this.type = newValue;
        break;
      case 2:
        this.databaseName = newValue;
        break;
      case 3:
        this.host = newValue;
        break;
      case 4:
        this.port = newValue;
        break;
      case 5:
        this.username = newValue;
        break;
      case 6:
        this.password = newValue;
        break;
    }
  }

  editCompleteRow(newValue: string[]) {
    this.alias = newValue[0];
    this.type = newValue[1];
    this.databaseName = newValue[2];
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
