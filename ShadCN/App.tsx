import "./index.css";
// import from the pie chart component
import { PieChartExample } from "./components/ui/PieChartExample";

function App() {
  // make the data for all the charts
  const totalCoursesData = [
    { status: "taken", numtaken: 6, fill: "#881124" },
    { status: "remaining", numtaken: 4, fill: "#E5E5E5" },
  ];

  const tagRequirementsData = [
    { status: "taken", numtaken: 3, fill: "#881124" },
    { status: "remaining", numtaken: 1, fill: "#E5E5E5" },
  ];

  const level300Data = [
    { status: "taken", numtaken: 2, fill: "#881124" },
    { status: "remaining", numtaken: 1, fill: "#E5E5E5" },
  ];

  // for each chart, just give it some parameters and pass in the data, and each will be constructed
  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <PieChartExample data={totalCoursesData} title="Total Courses" />
      <PieChartExample data={tagRequirementsData} title="Tag Requirements" />
      <PieChartExample data={level300Data} title="300-level Requirement" />
    </div>
  );
}

export default App;
