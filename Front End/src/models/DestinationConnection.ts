import { Application } from "../components/ApplicationPage/AppDashboard";
import { ColumnSortFilterOptions, InputField } from "./TableManagementModels";
import { TableRowData } from "./TableRowData";

export class DestinationConnection extends TableRowData {
  private destinationId: number;
  private alias: string;
  private accessKey: string;
  private secretKey: string;
  private bucketName: string;
  private region: string;
  // private appId: number;
  private application: Application;
  private isActive: boolean;

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
      validation: { required: true, minLength: 2, maxLength: 20 },
    },
    {
      name: "Bucket Name",
      label: "bucket name",
      isSelectable: false,
      type: "text",
      validation: {required: true, minLength: 2, maxLength: 100},
    },
    {
      name: "Region",
      label: "region",
      isSelectable: false,
      type: "text",
      validation: {required: true, minLength: 2, maxLength: 100},
    },
    {
      name: "Access Key",
      label: "access_key",
      isSelectable: false,
      type: "text",
      validation: { required: true },
    },
    {
      name: "Secret Key",
      label: "secret_key",
      isSelectable: false,
      type: "text",
      validation: { required: true },
      isHidden: true,
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
    isActive: boolean = false
  ) {
    super();
    this.destinationId = connectionId;
    this.alias = alias;
    this.bucketName = bucketName;
    this.region = region;
    this.accessKey = access_key;
    this.secretKey = secret_key;
    // this.appId = appId;
    this.application = application;
    this.isActive = isActive;
  }

  getId(): number {
    return this.destinationId;
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
