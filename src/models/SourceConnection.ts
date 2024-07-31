import InputField from "./InputField";
import { TableRowData } from "./TableRowData";

export class SourceConnection implements TableRowData {
  private connectionId: number;
  private alias: string;
  private type: string;
  private host: string;
  private port: string;
  private appId: number;
  private isActive: boolean;

  //Static variables
  private static columnWidths = ["5%", "30%", "15%", "15%", "15%", "5%", "10%", "5%"];

  private static inputFields: InputField[] = [
    {
      name: "Alias",
      label: "alias",
      type: "text",
      validation: { required: true, minLength: 2, maxLength: 20 }
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
      this.alias,
      this.type,
      this.host,
      this.port,
    ];
  }

  getId(): number {
    return this.connectionId;
  }

  getTableHeadings(): string[] {
    return ["Alias", "Type", "Host", "Port", "Active Status", "Edit", "Delete"];
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
      return [true, true, true, true];
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
        this.host = newValue;          
        break;
      case 3:
        this.port = newValue;          
        break;
      
    }
  }

  editCompleteRow(newValue: string[]) {
    this.alias = newValue[0];
    this.type = newValue[1];
    this.host = newValue[2];
    this.port = newValue[3];
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
