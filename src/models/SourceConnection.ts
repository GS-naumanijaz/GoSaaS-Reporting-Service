import { TableData } from "./TableData";

export class SourceConnection implements TableData {
  private connectionId: number;
  private alias: string;
  private type: string;
  private host: string;
  private port: string;
  private appId: number;
  private isActive: boolean;

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

  tableData(): string[] {
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

  tableHeadings(): string[] {
    return ["Connection ID", "Alias", "Type", "Host", "Port", "App ID", "Active Status", "Edit", "Delete"];
  }

  getTableHeader(): string {
      return "Source Connections"
  }

  getColumnWidths(): string[] {
      return ["10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%"];
  }
  //these widths shoould add upto 100%
  getCheckBoxWidth(): string {
      return "10%";
  }
  
  getDataType(): string[] {
      return ["number", "string", "string", "string", "string", "number"];
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
        this.connectionId = Number(newValue);
        break;
      
    }
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
