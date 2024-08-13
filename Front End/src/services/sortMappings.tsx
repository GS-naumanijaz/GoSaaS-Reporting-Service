export type FieldMappingKey = keyof typeof fieldMapping;
export const fieldMapping = {
  Alias: "alias",
  "Connection Type": "type",
  Host: "host",
  Port: "port",
  "Database Name": "databaseName",
  Username: "username",
} as const;
