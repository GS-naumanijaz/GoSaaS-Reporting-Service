import { ColumnSortFilterOptions, InputField } from "./TableManagementModels";
import { TableRowData } from "./TableRowData";
import { Application } from "../components/ApplicationPage/AppDashboard";

export class SourceConnection extends TableRowData {
  public id: number;
  public alias: string;
  private type: string;
  private host: string;
  private port: string;
  private databaseName: string;
  private username: string;
  private password: string;
  // private appId: number;
  private application: Application;
  private isActive: boolean;
  public lastTestResult?: boolean;
  private schema: string;

  private static dbTypes = [
    "SQL",
    "POSTGRES",
    "MYSQL",
    "MARIADB",
    "ORACLE",
    "SQLSERVER",
    "SQLITE",
    "H2",
    "DB2",
    "DERBY",
    "HSQLDB",
    "FIREBIRD",
    "CASSANDRA",
    "MONGO",
    "INFORMIX",
    "SYBASE",
    "AWSATHENA",
    "NEO4J",
    "SNOWFLAKE",
    "REDSHIFT",
    "PRESTO",
  ];

  //Static variables
  private static tableHeader = "Source Connections";
  private static tableHeadings = [
    "",
    "Alias",
    "Connection Type",
    "Schema",
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
    "10%",
    "12.5%",
    "10%",
    "12.5%",
    "7.5%",
    "7.5%",
    "7.5%",
    "10%",
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
      type: "text",
      validation: {
        required: true,
        customErrorMessage: "Connection type is required.",
      },
    },
    {
      name: "Schema (if applicable)",
      label: "schema",
      isSelectable: false,
      type: "text",
      validation: {
        required: false,
        minLength: 3,
        maxLength: 50,
        pattern: /^[a-zA-Z0-9 _-]+$/,
        customErrorMessage:
          "Schema must be 3-50 characters long and contain only letters, numbers, spaces, underscores, or hyphens.",
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
        maxLength: 50,
        pattern: /^[a-zA-Z0-9 ._-]+$/,
        customErrorMessage:
          "Host must be 4-50 characters long and contain only letters, numbers, dots, spaces, or hyphens.",
      },
    },
    {
      name: "Port",
      label: "port",
      isSelectable: false,
      type: "number",
      validation: {
        required: true,
        minLength: 1,
        maxLength: 5,
        pattern: /^\d+$/,
        customErrorMessage:
          "Port must be 1-5 characters long and must contain only numbers.",
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
      type: "password",
      validation: {
        required: true,
        minLength: 4,
        maxLength: 100,
        pattern: /^[a-zA-Z0-9\W_]+$/,
        customErrorMessage:
          "Password must be 8-100 characters long and contain only letters, numbers, or special characters.",
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
    isActive: boolean = false,
    lastTestResult?: boolean,
    schema: string = ""
  ) {
    super();
    this.id = connectionId;
    this.alias = alias;
    this.type = connection_type;
    this.host = host;
    this.port = port;
    this.databaseName = database_name;
    this.username = username;
    this.password = password;
    this.isActive = isActive;
    this.application = application;
    this.lastTestResult = lastTestResult;
    this.schema = schema;
  }

  getId(): number {
    return this.id;
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
      this.schema,
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

  getLastTestResult(): boolean | undefined {
    return this.lastTestResult;
  }

  setLastTestResult(result: boolean | undefined): void {
    this.lastTestResult = result;
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
        this.schema = newValue;
        break;
      case 3:
        this.databaseName = newValue;
        break;
      case 4:
        this.host = newValue;
        break;
      case 5:
        this.port = newValue;
        break;
      case 6:
        this.username = newValue;
        break;
      case 7:
        this.password = newValue;
        break;
    }
  }

  editCompleteRow(newValue: string[]) {
    this.alias = newValue[0];
    this.type = newValue[1];
    this.schema = newValue[2];
    this.databaseName = newValue[3];
    this.host = newValue[4];
    this.port = newValue[5];
    this.username = newValue[6];
    this.password = newValue[7];
  }

  getPartialData(indexes: number[]): Partial<SourceConnection> {
    console.log("hello source");
    return indexes.reduce((partialData, index) => {
      return { ...partialData, ...this.getPartialDataObject(index) };
    }, {});
  }

  private getPartialDataObject(index: number): Partial<SourceConnection> {
    switch (index) {
      case 0:
        return { alias: this.alias } as Partial<SourceConnection>;
      case 1:
        return { type: this.type } as Partial<SourceConnection>;
      case 2:
        return { schema: this.schema } as Partial<SourceConnection>;
      case 3:
        return { databaseName: this.databaseName } as Partial<SourceConnection>;
      case 4:
        return { host: this.host } as Partial<SourceConnection>;
      case 5:
        return { port: this.port } as Partial<SourceConnection>;
      case 6:
        return { username: this.username } as Partial<SourceConnection>;
      case 7:
        return { password: this.password } as Partial<SourceConnection>;
      default:
        return {} as Partial<SourceConnection>;
    }
  }

  getInputFields(): InputField[] {
    return SourceConnection.inputFields;
  }

  getSortFilterOptions(): ColumnSortFilterOptions[] {
    return SourceConnection.sortFilterOptions;
  }

  getEditAccess(): boolean[] {
    return [true, true, true, true, true, true, true, true];
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

  requiresRedirect(): boolean {
    return false;
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
