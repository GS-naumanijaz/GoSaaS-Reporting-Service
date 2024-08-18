// mappings
export type FieldMappingKey = keyof typeof fieldMapping;
export type FieldMappingValues =
  (typeof fieldMapping)[keyof typeof fieldMapping];
export type MappedFormData = {
  [key in FieldMappingValues]?: string;
};

export const fieldMapping = {
  // source
  Alias: "alias",
  "Connection Type": "type",
  Host: "host",
  Port: "port",
  "Database Name": "databaseName",
  Username: "username",
  Password: "password",
  // destination
  "Active Status": "isActive",
  "Bucket Name": "bucketName",
  Region: "region",
  "Access Key": "accessKey",
  "Secret Key": "secretKey",
  Description: "description",
  // reports
  Connection: "sourceConnection",
  Destination: "destinationConnection",
  "Stored Procedures": "storedProcedure",
  Parameters: "params",
} as const;

//
export const mapFormDataKeys = (
  formData: Record<string, string>
): MappedFormData => {
  const mappedData: MappedFormData = {};

  Object.keys(formData).forEach((key) => {
    const mappedKey = fieldMapping[key as keyof typeof fieldMapping];
    if (mappedKey) {
      mappedData[mappedKey] = formData[key];
    }
  });

  return mappedData;
};


// Create the reverse mapping
export const reverseFieldMapping = Object.fromEntries(
  Object.entries(fieldMapping).map(([key, value]) => [value, key])
) as Record<string, keyof typeof fieldMapping>;
