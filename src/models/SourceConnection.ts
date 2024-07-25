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
    return ["", "Connection ID", "Alias", "Type", "Host", "Port", "App ID", "Active Status", "Edit", "Delete"];
  }

  requiresStatusToggle(): boolean {
    return true;
  }

  getSwitchStatus(): boolean {
      return this.isActive;
  }

  toggleSwitchStatus() {
      this.isActive = !this.isActive;
  }
}
