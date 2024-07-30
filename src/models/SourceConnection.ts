import InputField from "./InputField";
import { TableRowData } from "./TableData";

export class SourceConnection implements TableRowData {
  private connectionId: number;
  private alias: string;
  private type: string;
  private host: string;
  private port: string;
  private appId: number;
  private isActive: boolean;

  //Static variables
  private static columnWidths = ["5%", "5%", "30%", "10%", "15%", "10%", "10%", "5%", "5%", "5%"];

  private static inputFields: InputField[] = [
    {
      name: "Connection ID",
      label: "connectionId",
      type: "number",
      validation: { required: true }
    },
    {
      name: "Alias",
      label: "alias",
      type: "text",
      validation: { required: true, minLength: 2, maxLength: 10 }
    },
    {
      name: "Type",
      label: "type",
      type: "text",
      validation: { required: true, minLength: 2, maxLength: 10 }
    },
    {
      name: "Host",
      label: "host",
      type: "text",
      validation: { required: true }
    },
    {
      name: "Port",
      label: "port",
      type: "text",
      validation: { required: true }
    },
    {
      name: "App ID",
      label: "appId",
      type: "number",
      validation: { required: true }
    },
  ]

  constructor(
    connectionId: number,
    alias: string,
    type: string,
    host: string,
    port: string,
    appId: number,
    isActive: boolean
  ) {
    this.connectionId = connectionId;
    this.alias = alias;
    this.type = type;
    this.host = host;
    this.port = port;
    this.appId = appId;
    this.isActive = isActive;
  }

  getTableData(): string[] {
    return [
      String(this.connectionId),
      this.alias,
      this.type,
      this.host,
      this.port,
      String(this.appId),
    ];
  }

  getId(): number {
    return this.connectionId;
  }

  getTableHeadings(): string[] {
    return ["Connection ID", "Alias", "Type", "Host", "Port", "App ID", "Active Status", "Edit", "Delete"];
  }

  getTableHeader(): string {
      return "Source Connections"
  }

  getColumnWidths(): string[] {
      return SourceConnection.columnWidths.slice(1);
  }

  getCheckBoxWidth(): string {
      return SourceConnection.columnWidths[0];
  }

  getInputFields(): InputField[] {
    return SourceConnection.inputFields;
  }

  getEditAccess(): boolean[] {
      return [false, true, true, true, true, true];
  }

  editRowData(elementIndex: number, newValue: string): void {
    switch (elementIndex) {
      case 0:
        this.connectionId = Number(newValue);
        break;
      case 1:
        this.alias = newValue;
        break;
      case 2:
        this.type = newValue;          
        break;
      case 3:
        this.host = newValue;          
        break;
      case 4:
        this.port = newValue;          
        break;
      case 5:
        this.appId = Number(newValue);
        break;
      
    }
  }

  editCompleteRow(newValue: string[]) {
    this.connectionId = Number(newValue[0]);
    this.alias = newValue[1];
    this.type = newValue[2];
    this.host = newValue[3];
    this.port = newValue[4];
    this.appId = Number(newValue[5]);
  }

  requiresStatusToggle(): boolean {
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

}
