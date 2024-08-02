import { SourceConnection } from "../../models/SourceConnection";
import { TableManager } from "../../models/TableManager";
import CustomTable from "../Shared/CustomTable";

const SourceConnectionData = () => {
  const sampleData: SourceConnection[] = [
    new SourceConnection(
      1,
      "Main Server",
      "SQL",
      "Primary Database",
      "192.168.1.10",
      "1424",
      "adminuser",
      "admin123",
      true
    ),
    new SourceConnection(
      2,
      "Backup Server",
      "NoSQL",
      "Secondary Database",
      "192.168.1.11",
      "27018",
      "backupuser",
      "backup123",
      false
    ),

    new SourceConnection(
      3,
      "Analytics Server",
      "SQL",
      "Analytics Database",
      "192.168.1.12",
      "3307",
      "analyticsuser",
      "analytics123",
      true
    ),

    new SourceConnection(
      4,
      "Staging Server",
      "SQL",
      "Staging Database",
      "192.168.1.13",
      "5433",
      "staginguser",
      "staging123",
      false
    ),
  ];

  const manager = new TableManager(sampleData);

  return <CustomTable tableManager={manager} />;
};

export default SourceConnectionData;
