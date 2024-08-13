import { Application } from "../components/ApplicationPage/AppDashboard";
import { ColumnSortFilterOptions, InputField } from "./TableManagementModels";
import { TableRowData } from "./TableRowData";

export class DestinationConnection extends TableRowData {
  private destinationId: number;
  private alias: string;
  private type: string;
  private url: string;
  private port: string;
  private access_key: string;
  private secret_key: string;
  // private appId: number;
  private application: Application;
  private isActive: boolean;

  //Static variables
  private static tableHeader = "Destination Connections";
  private static tableHeadings = [
    "",
    "Alias",
    "Type",
    "URL",
    "Port",
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
    "10%",
    "10%",
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
      name: "Type",
      label: "type",
      isSelectable: true,
      options: ["SQL", "NoSQL"],
    },
    {
      name: "Url",
      label: "url",
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
      dropdownFilter: ["SQL", "NoSQL"],
    },
    {
      isEnabled: true,
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
    type: string = "",
    url: string = "",
    port: string = "",
    access_key: string = "",
    secret_key: string = "",
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
    },
    isActive: boolean = false
  ) {
    super();
    this.destinationId = connectionId;
    this.alias = alias;
    this.type = type;
    this.url = url;
    this.port = port;
    this.access_key = access_key;
    this.secret_key = secret_key;
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
      this.type,
      this.url,
      this.port,
      this.access_key,
      this.secret_key,
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
        this.type = newValue;
        break;
      case 2:
        this.url = newValue;
        break;
      case 3:
        this.port = newValue;
        break;
      case 4:
        this.access_key = newValue;
        break;
      case 5:
        this.secret_key = newValue;
        break;
    }
  }

  editCompleteRow(newValue: string[]) {
    this.alias = newValue[0];
    this.type = newValue[1];
    this.url = newValue[2];
    this.port = newValue[3];
    this.access_key = newValue[4];
    this.secret_key = newValue[5];
  }

  getInputFields(): InputField[] {
    return DestinationConnection.inputFields;
  }

  getSortFilterOptions(): ColumnSortFilterOptions[] {
    return DestinationConnection.sortFilterOptions;
  }

  getEditAccess(): boolean[] {
    return [true, true, true, true, true, true];
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
