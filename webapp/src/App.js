// webapp/src/App.js
import React, { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from your Go API
    fetch("/api/query?startDate=2023-01-01&endDate=2023-12-31")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div>
      <h1>Go and React Integration</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{/* Display your data here */}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
