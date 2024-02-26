import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";
import * as Bootstrap from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import MultiSelect from "react-select";
import PieComponent from "./PieComponent";
import StatsComponent from "./stats";
import LeaderboardComponent from "./leaderboard";
import KPIComponent from "./kpiComponent";

import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

function App() {
  const formatDate = (inputDate) => {
    inputDate = new Date(inputDate);
    const date = new Date(inputDate);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [vrsRsidOptions, setVrsRsidOptions] = useState([]);
  const [selectedVrsRsid, setSelectedVrsRsid] = useState([]);
  const [entityOptions, setEntityOptions] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [selection, setSelection] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  const fetchData = async (sd, ed, filters = false) => {
    try {
      const response = await axios.get("http://localhost:7778/api/query", {
        params: {
          startDate: sd,
          endDate: ed,
        },
      });
      console.log(response.data);
      if (filters === false) {
        // Extract unique values
        const uniqueVrsRsidOptions = [
          ...new Set(response.data.map((item) => item.VrsRsid)),
        ];
        const uniqueEntityOptions = [
          ...new Set(response.data.map((item) => item.entity)),
        ];

        // Update the state with the options
        setVrsRsidOptions(uniqueVrsRsidOptions);
        setEntityOptions(uniqueEntityOptions);
      }
      // Set data for further filtering
      setData(response.data);
      setIsDataFetched(true);

      if (filters === true) {
        const selectedFilters = {
          vrsRsid: selectedVrsRsid.map((option) => option.value),
          entity: selectedEntity.map((option) => option.value),
        };
        console.log(selectedFilters);
        const filteredData = response.data.filter((item) => {
          return (
            (!selectedFilters.vrsRsid.length ||
              selectedFilters.vrsRsid.includes(item.VrsRsid)) &&
            (!selectedFilters.entity.length ||
              selectedFilters.entity.includes(item.entity))
          );
        });
        console.log(filteredData);
        // Update the state with filtered data
        setFilteredData(filteredData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateFilters = (elem, item) => {
    const selectData = filteredData.length !== 0 ? filteredData : data;
    console.log(item);
    const filtersData = selectData.filter((d) =>
      item.some((x) => d[elem] === x.value)
    );
    // Extract unique values
    const uniqueVrsRsidOptions = [
      ...new Set(filtersData.map((item) => item.VrsRsid)),
    ];
    const uniqueEntityOptions = [
      ...new Set(filtersData.map((item) => item.entity)),
    ];

    // Update the state with the options
    setVrsRsidOptions(uniqueVrsRsidOptions);
    setEntityOptions(uniqueEntityOptions);
  };

  const isInitialMount = useRef(true);
  useEffect(() => {
    // Calculate the start date for the last 7 days
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - 3);
    endDate.setDate(endDate.getDate() - 1);
    setSelection([
      {
        startDate: startDate,
        endDate: endDate,
        key: "selection",
      },
    ]);

    console.log(isInitialMount);
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Initialize dateRange state with the default values
    setDateRange([startDate, endDate]);

    // Fetch data based on the default date range
    fetchData(formatDate(startDate), formatDate(endDate));
  }, []);

  const handleSelect = (ranges) => {
    setSelection([ranges.selection]);

    console.log("Start Date:", ranges.selection.startDate);
    console.log("End Date:", ranges.selection.endDate);
  };

  const handleFocusChange = (focusedRange) => {
    // Calendar is closed only when both start and end dates are selected
    if (focusedRange.startDate && focusedRange.endDate) {
      setCalendarOpen(true);
    }
  };

  const handleToggleCalendar = () => {
    setCalendarOpen(!isCalendarOpen);
  };

  return (
    <div className="w-100 clearfix">
      <div className="filters w-100 p-2 clearfix">
        <div className="filter-set-1 w-25 p-2 float-start">
          <label className="filterLabels" htmlFor="datePicker">
            Select Date Range:
          </label>
          <br />
          <div
            id="dtRange"
            className="bg-light border border-1 border-secondary rounded"
            onClick={handleToggleCalendar}
          >
            <span className="align-middle ms-2">
              {/* Display selected date range */}
              {selection[0].startDate.toLocaleDateString()} -{" "}
              {selection[0].endDate
                ? selection[0].endDate.toLocaleDateString()
                : "Select end date"}
            </span>
          </div>

          {isCalendarOpen && (
            <DateRangePicker
              ranges={selection}
              onChange={handleSelect}
              onFocusChange={handleFocusChange}
            />
          )}
        </div>

        <div className="filter-set-2 w-25 p-2 float-start">
          <label className="filterLabels" htmlFor="entity">
            Select Entity:
          </label>
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
            onChange={(selectedOptions) => {
              setSelectedEntity(selectedOptions);
              updateFilters("entity", selectedOptions);
            }}
          />
        </div>

        <div className="filter-set-1 w-25 p-2 float-start">
          <label className="filterLabels" htmlFor="vrsRsid">
            Select VrsRsid:
          </label>
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
            onChange={(selectedOptions) => {
              setSelectedVrsRsid(selectedOptions);
              updateFilters("VrsRsid", selectedOptions);
            }}
          />
        </div>

        <div className="filter-set-2 w-25 p-2 float-start">
          {/* <label htmlFor="selectFilters">Select Filters:</label> */}
          <br />
          <Bootstrap.Button
            variant="primary"
            id="selectFilters"
            name="selectFilters"
            className="custom-button"
            onClick={() =>
              fetchData(
                formatDate(selection[0].startDate),
                formatDate(selection[0].endDate),
                true
              )
            }
          >
            Select Filters
          </Bootstrap.Button>
        </div>
      </div>

      <div id="dashboard" className="m-2 w-100 clearfix d-flex">
        <div className="piecharts m-2 float-start flex-fill">
          {isDataFetched && (
            <PieComponent data={data} filteredData={filteredData} />
          )}
        </div>
        <div className="stats mx-1 my-2 float-start flex-fill">
          {isDataFetched && (
            <StatsComponent data={data} ed={formatDate(selection[0].endDate)} />
          )}
        </div>
      </div>
      <div className="leaderboard m-2 w-100 clearfix d-flex">
        {isDataFetched && <LeaderboardComponent data={data} />}
      </div>
      <div className="kpi m-2 w-100 clearfix d-flex">
        {isDataFetched && <KPIComponent data={data} />}
      </div>
    </div>
  );
}

export default App;
