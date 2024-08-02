import { ReportsConnection } from "../../models/ReportsConnection";
import { TableManager } from "../../models/TableManager";
import CustomTable from "../Shared/CustomTable";

const ReportsConnectionData = () => {
  const sampleData: ReportsConnection[] = [
    new ReportsConnection(
      1,
      "Initial Report",
      "This is the first report",
      "Main Server",
      "Spring Boot",
      "Procedure 1",
      "Parameter 1, Parameter 2",
      true
    ),
    new ReportsConnection(
      2,
      "Sales Report",
      "Quarterly sales report",
      "Sales Server",
      "Node.js",
      "Procedure 2",
      "Parameter A, Parameter B",
      false
    ),

    new ReportsConnection(
      3,
      "Inventory Report",
      "Monthly inventory status",
      "Inventory Server",
      "Django",
      "Procedure 3",
      "Parameter X, Parameter Y, Parameter Z",
      true
    ),

    new ReportsConnection(
      4,
      "Customer Feedback Report",
      "Customer feedback summary",
      "Feedback Server",
      "Flask",
      "Procedure 4",
      "Parameter 1, Parameter 2, Parameter 3",
      false
    ),
  ];

  const manager = new TableManager(sampleData);

  return <CustomTable tableManager={manager} />;
};

export default ReportsConnectionData;
