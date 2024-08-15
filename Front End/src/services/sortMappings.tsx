export type FieldMappingKey = keyof typeof fieldMapping;
export const fieldMapping = {
  // source
  Alias: "alias",
  "Connection Type": "type",
  Host: "host",
  Port: "port",
  "Database Name": "databaseName",
  Username: "username",
  // destination
  "Active Status": "isActive",
  "Bucket Name": "bucketName",
  Region: "region",
  "Access Key": "accessKey",
  Description: "description",
  // reports
  Connection: "sourceConnection",
  Destination: "destinationConnection",
  "Stored Procedures": "storedProcedure",
  Parameters: "params",
} as const;
