import { DestinationConnection } from "../../models/DestinationConnection";
import { TableManager } from "../../models/TableManager";
import CustomTable from "../Shared/CustomTable";

const DestinationConnectionData = () => {
  const sampleData: DestinationConnection[] = [
    new DestinationConnection(
      1,
      "Spring Boot",
      "SQL",
      "192.168.1.1",
      "8080",
      "Key1",
      "Key2",
      true
    ),
    new DestinationConnection(
      2,
      "Node.js",
      "MongoDB",
      "192.168.1.2",
      "27017",
      "Key3",
      "Key4",
      false
    ),

    new DestinationConnection(
      3,
      "Django",
      "PostgreSQL",
      "192.168.1.3",
      "5432",
      "Key5",
      "Key6",
      true
    ),

    new DestinationConnection(
      4,
      "Flask",
      "MySQL",
      "192.168.1.4",
      "3306",
      "Key7",
      "Key8",
      false
    ),
  ];

  const manager = new TableManager(sampleData);

  return <CustomTable tableManager={manager} />;
};

export default DestinationConnectionData;
