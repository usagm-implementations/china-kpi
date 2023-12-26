import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Bootstrap from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import HighchartsComponent from "./HighchartsComponent";
import "react-datepicker/dist/react-datepicker.css";
import MultiSelect from "react-select";

function App() {
  const formatDate = (inputDate) => {
    inputDate = new Date(inputDate);
    const date = new Date(inputDate);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const [data] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [multiSelectOptions, setMultiSelectOptions] = useState([]);

  const fetchData = async (sd, ed) => {
    try {
      const response = await axios.get("http://localhost:7778/api/query", {
        params: {
          startDate: sd,
          endDate: ed,
        },
      });
      console.log(response.data);

      // Extract unique VrsRsid values
      const vrsRsidOptions = [
        ...new Set(response.data.map((item) => item.VrsRsid)),
      ];

      // Update the state with the options
      setMultiSelectOptions(vrsRsidOptions);

      console.log(vrsRsidOptions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <DatePicker
        showIcon
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update);
          // Call fetchData when date range is selected
          if (update[0] && update[1]) {
            fetchData(formatDate(update[0]), formatDate(update[1]));
          }
        }}
        shouldCloseOnSelect={true}
      />

      <MultiSelect
        isMulti
        name="vrsRsid"
        options={multiSelectOptions.map((vrsRsid) => ({
          value: vrsRsid,
          label: vrsRsid,
        }))}
        className="basic-multi-select"
        classNamePrefix="select"
      />
      {/* <Bootstrap.Button
        variant="primary"
        className="custom-button"
        onClick={() => fetchData(formatDate(startDate), formatDate(endDate))}
      >
        Select Filters
      </Bootstrap.Button> */}
      <HighchartsComponent />
    </div>
  );
}

export default App;
