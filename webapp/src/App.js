import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import * as Bootstrap from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import MultiSelect from "react-select";
import HighchartsComponent from "./HighchartsComponent";
import "react-datepicker/dist/react-datepicker.css";

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
  const [vrsRsidOptions, setVrsRsidOptions] = useState([]);
  const [selectedVrsRsid, setSelectedVrsRsid] = useState([]);
  const [authorNameOptions, setAuthorNameOptions] = useState([]);
  const [selectedAuthorName, setSelectedAuthorName] = useState([]);
  const [languageOptions, setlanguageOptions] = useState([]);
  const [selectedlanguage, setSelectedlanguage] = useState([]);
  const [entityOptions, setEntityOptions] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState([]);
  const [statusOptions, setstatusOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [reportNmOptions, setReportNmOptions] = useState([]);
  const [selectedReportNm, setSelectedReportNm] = useState([]);

  const fetchData = async (sd, ed) => {
    console.log(`${sd} => ${ed}`);
    try {
      const response = await axios.get("http://localhost:7778/api/query", {
        params: {
          startDate: sd,
          endDate: ed,
        },
      });
      console.log(response.data);

      // Extract unique values
      const uniqueVrsRsidOptions = [
        ...new Set(response.data.map((item) => item.VrsRsid)),
      ];
      const uniqueAuthorNameOptions = [
        ...new Set(response.data.map((item) => item.author_name)),
      ];
      const uniqueLanguageOptions = [
        ...new Set(response.data.map((item) => item.language)),
      ];
      const uniqueEntityOptions = [
        ...new Set(response.data.map((item) => item.entity)),
      ];
      const uniqueStatusOptions = [
        ...new Set(response.data.map((item) => item.status)),
      ];
      const uniqueReportNmOptions = [
        ...new Set(response.data.map((item) => item.report_name)),
      ];

      // Update the state with the options
      setVrsRsidOptions(uniqueVrsRsidOptions);
      setAuthorNameOptions(uniqueAuthorNameOptions);
      setlanguageOptions(uniqueLanguageOptions);
      setEntityOptions(uniqueEntityOptions);
      setstatusOptions(uniqueStatusOptions);
      setReportNmOptions(uniqueReportNmOptions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Set default date range (past 2 days)
    const defaultEndDate = new Date();
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 2);

    // Initialize dateRange state with the default values
    setDateRange([defaultStartDate, defaultEndDate]);

    // Fetch data based on the default date range
    fetchData(formatDate(defaultStartDate), formatDate(defaultEndDate));
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <div className="w-100 clearfix">
      <div className="filters w-100 p-2 clearfix">
        <div className="filter-set-1 w-25 p-2 float-start">
          <label htmlFor="datePicker">Select Date Range:</label>
          <br />
          <DatePicker
            id="datePicker"
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
        </div>

        <div className="filter-set-1 w-25 p-2 float-start">
          <label htmlFor="vrsRsid">Select VrsRsid:</label>
          <MultiSelect
            id="vrsRsid"
            isMulti
            name="vrsRsid"
            options={vrsRsidOptions?.map((vrsRsid) => ({
              value: vrsRsid,
              label: vrsRsid,
            }))}
            className="basic-multi-select"
            classNamePrefix="select"
            value={selectedVrsRsid}
            onChange={(selectedOptions) => setSelectedVrsRsid(selectedOptions)}
          />
        </div>

        <div className="filter-set-1 w-25 p-2 float-start">
          <label htmlFor="authorName">Select Author Name:</label>
          <MultiSelect
            id="authorName"
            isMulti
            name="authorName"
            options={authorNameOptions?.map((author) => ({
              value: author,
              label: author,
            }))}
            className="basic-multi-select"
            classNamePrefix="select"
            value={selectedAuthorName}
            onChange={(selectedOptions) =>
              setSelectedAuthorName(selectedOptions)
            }
          />
        </div>

        <div className="filter-set-1 w-25 p-2 float-start">
          <label htmlFor="language">Select Language:</label>
          <MultiSelect
            id="language"
            isMulti
            name="language"
            options={languageOptions?.map((lang) => ({
              value: lang,
              label: lang,
            }))}
            className="basic-multi-select"
            classNamePrefix="select"
            value={selectedlanguage}
            onChange={(selectedOptions) => setSelectedlanguage(selectedOptions)}
          />
        </div>
      </div>
      <div className="filters w-100 p-2 clearfix">
        <div className="filter-set-2 w-25 p-2 float-start">
          <label htmlFor="entity">Select Entity:</label>
          <MultiSelect
            id="entity"
            isMulti
            name="entity"
            options={entityOptions?.map((ent) => ({
              value: ent,
              label: ent,
            }))}
            className="basic-multi-select"
            classNamePrefix="select"
            value={selectedEntity}
            onChange={(selectedOptions) => setSelectedEntity(selectedOptions)}
          />
        </div>

        <div className="filter-set-2 w-25 p-2 float-start">
          <label htmlFor="status">Select Status:</label>
          <MultiSelect
            id="status"
            isMulti
            name="status"
            options={statusOptions?.map((st) => ({
              value: st,
              label: st,
            }))}
            className="basic-multi-select"
            classNamePrefix="select"
            value={selectedStatus}
            onChange={(selectedOptions) => setSelectedStatus(selectedOptions)}
          />
        </div>

        <div className="filter-set-2 w-25 p-2 float-start">
          <label htmlFor="reportNm">Select Report Name:</label>
          <MultiSelect
            id="reportNm"
            isMulti
            name="reportNm"
            options={reportNmOptions?.map((report) => ({
              value: report,
              label: report,
            }))}
            className="basic-multi-select"
            classNamePrefix="select"
            value={selectedReportNm}
            onChange={(selectedOptions) => setSelectedReportNm(selectedOptions)}
          />
        </div>
        <div className="filter-set-2 w-25 p-2 float-start">
          <label htmlFor="selectFilters">Select Filters:</label>
          <br />
          <Bootstrap.Button
            variant="primary"
            id="selectFilters"
            name="selectFilters"
            className="custom-button"
            onClick={() =>
              fetchData(formatDate(startDate), formatDate(endDate))
            }
          >
            Select Filters
          </Bootstrap.Button>
        </div>
      </div>
      <div>
        <HighchartsComponent />
      </div>
    </div>
  );
}

export default App;
