import React, { useState, useEffect } from "react";
import axios from "axios";
import HighchartsComponent from "./HighchartsComponent";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from your Go API using Axios
        const response = await axios.get("http://localhost:7778/api/query", {
          params: {
            startDate: "2023-12-01",
            endDate: "2023-12-03",
          },
        });
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Go and React Integration</h1>

      <HighchartsComponent />
    </div>
  );
}

export default App;
