import { SourceConnection } from "../models/SourceConnection";
import { TableManager } from "../models/TableManager";
import CustomTable from "./CustomTable";

const ProductDetails = () => {
  const sampleData: SourceConnection[] = [
    new SourceConnection(1, "Main Server", "SQL", "192.168.1.1", "5432", true),
    new SourceConnection(
      2,
      "Backup Server",
      "NoSQL",
      "192.168.1.2",
      "27017",
      false
    ),
    new SourceConnection(
      3,
      "Analytics Server",
      "SQL",
      "192.168.1.3",
      "3306",
      false
    ),
    new SourceConnection(4, "Test Server", "SQL", "192.168.1.4", "1521", true),
    new SourceConnection(
      5,
      "Dev Server",
      "NoSQL",
      "192.168.1.5",
      "6379",
      false
    ),
  ];

  const manager = new TableManager(sampleData);

  return <CustomTable tableManager={manager} />;
};

export default ProductDetails;
