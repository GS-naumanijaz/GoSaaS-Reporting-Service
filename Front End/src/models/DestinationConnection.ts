import { Application } from "../components/ApplicationPage/AppDashboard";
import { ColumnSortFilterOptions, InputField } from "./TableManagementModels";
import { TableRowData } from "./TableRowData";

export class DestinationConnection extends TableRowData {
  public id: number;
  public alias: string;
  public accessKey: string;
  public secretKey: string;
  public bucketName: string;
  public region: string;
  private application: Application;
  private isActive: boolean;
  public lastTestResult?: boolean;

  //Static variables
  private static tableHeader = "Destination Connections";
  private static tableHeadings = [
    "",
    "Alias",
    "Bucket Name",
    "Region",
    "Access Key",
    "Secret Key",
    "Active Status",
    "Edit",
    "Delete",
    "",
  ];
  private static columnWidths = [
    "5%",
    "25%",
    "20%",
    "10%",
    "10%",
    "10%",
    "5%",
    "5%",
    "5%",
    "5",
  ];

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
      name: "Bucket Name",
      label: "bucket name",
      isSelectable: false,
      type: "text",
      validation: {
        required: true,
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-Z0-9 _-]+$/,
        customErrorMessage:
          "Bucket Name must be 2-100 characters long and contain only letters, numbers, spaces, underscores, or hyphens.",
      },
    },
    {
      name: "Region",
      label: "region",
      isSelectable: false,
      type: "text",
      validation: {
        required: true,
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-Z0-9 _-]+$/,
        customErrorMessage:
          "Region must be 2-100 characters long and contain only letters, numbers, spaces, underscores, or hyphens.",
      },
    },
    {
      name: "Access Key",
      label: "access_key",
      isSelectable: false,
      type: "text",
      validation: {
        required: true,
        minLength: 8,
        maxLength: 50,
        pattern: /^[a-zA-Z0-9 _-]+$/,
        customErrorMessage:
          "Access Key must be 8-50 characters long and contain only letters, numbers, spaces, underscores, or hyphens.",
      },
    },
    {
      name: "Secret Key",
      label: "secret_key",
      isSelectable: false,
      isHidden: false,
      type: "password",
      validation: {
        required: true,
        minLength: 8,
        maxLength: 100,
        pattern: /^[a-zA-Z0-9 _-]+$/,
        customErrorMessage:
          "Secret Key must be 8-50 characters long and contain only letters, numbers, spaces, underscores, or hyphens.",
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
    access_key: string = "",
    secret_key: string = "",
    bucketName: string = "",
    region: string = "",
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
    lastTestResult?: boolean
  ) {
    super();
    this.id = connectionId;
    this.alias = alias;
    this.bucketName = bucketName;
    this.region = region;
    this.accessKey = access_key;
    this.secretKey = secret_key;
    this.application = application;
    this.isActive = isActive;
    this.lastTestResult = lastTestResult;
  }

  getId(): number {
    return this.id;
  }

  getAlias(): string {
    return this.alias;
  }

  getAccessKey(): string {
    return this.accessKey;
  }

  getSecretKey(): string {
    return this.secretKey;
  }

  getBucketName(): string {
    return this.bucketName;
  }

  getRegion(): string {
    return this.region;
  }

  getTableData(): string[] {
    return [
      this.alias,
      this.bucketName,
      this.region,
      this.accessKey,
      this.secretKey,
    ];
  }

  getTableHeadings(): string[] {
    return DestinationConnection.tableHeadings.slice(1);
  }

  getTableHeader(): string {
    return DestinationConnection.tableHeader;
  }

  getColumnWidths(): string[] {
    return DestinationConnection.columnWidths.slice(1);
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
        this.bucketName = newValue;
        break;
      case 2:
        this.region = newValue;
        break;
      case 3:
        this.accessKey = newValue;
        break;
      case 4:
        this.secretKey = newValue;
        break;
    }
  }

  editCompleteRow(newValue: string[]) {
    this.alias = newValue[0];
    this.bucketName = newValue[1];
    this.region = newValue[2];
    this.accessKey = newValue[3];
    this.secretKey = newValue[4];
  }

  getPartialData(indexes: number[]): Partial<DestinationConnection> {
    return indexes.reduce((partialData, index) => {
      return { ...partialData, ...this.getPartialDataObject(index) };
    }, {});
  }

  private getPartialDataObject(index: number): Partial<DestinationConnection> {
    switch (index) {
      case 0:
        return { alias: this.alias } as Partial<DestinationConnection>;
      case 2:
        return {
          databaseName: this.bucketName,
        } as Partial<DestinationConnection>;
      case 3:
        return { host: this.region } as Partial<DestinationConnection>;
      case 1:
        return { type: this.accessKey } as Partial<DestinationConnection>;
      case 4:
        return { port: this.secretKey } as Partial<DestinationConnection>;
      default:
        return {} as Partial<DestinationConnection>;
    }
  }

  getInputFields(): InputField[] {
    return DestinationConnection.inputFields;
  }

  getSortFilterOptions(): ColumnSortFilterOptions[] {
    return DestinationConnection.sortFilterOptions;
  }

  getEditAccess(): boolean[] {
    return [true, true, true, true, true];
  }

  requiresCheckBox(): boolean {
    return true;
  }

  getCheckBoxWidth(): string {
    return DestinationConnection.columnWidths[0];
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
