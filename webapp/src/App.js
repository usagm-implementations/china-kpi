import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";
import * as Bootstrap from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import MultiSelect from "react-select";
import PieComponent from "./PieComponent";
import StatsComponent from "./stats";
import LeaderboardComponent from "./leaderboard";
import KPIComponent from "./kpiComponent";
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

  const [data, setData] = useState([]);
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
  const [filteredData, setFilteredData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

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
      }
      // Set data for further filtering
      setData(response.data);
      setIsDataFetched(true);

      if (filters === true) {
        const selectedFilters = {
          vrsRsid: selectedVrsRsid.map((option) => option.value),
          authorName: selectedAuthorName.map((option) => option.value),
          language: selectedlanguage.map((option) => option.value),
          entity: selectedEntity.map((option) => option.value),
          status: selectedStatus.map((option) => option.value),
          reportNm: selectedReportNm.map((option) => option.value),
        };
        console.log(selectedFilters);
        const filteredData = response.data.filter((item) => {
          return (
            (!selectedFilters.vrsRsid.length ||
              selectedFilters.vrsRsid.includes(item.VrsRsid)) &&
            (!selectedFilters.authorName.length ||
              selectedFilters.authorName.includes(item.author_name)) &&
            (!selectedFilters.language.length ||
              selectedFilters.language.includes(item.language)) &&
            (!selectedFilters.entity.length ||
              selectedFilters.entity.includes(item.entity)) &&
            (!selectedFilters.status.length ||
              selectedFilters.status.includes(item.status)) &&
            (!selectedFilters.reportNm.length ||
              selectedFilters.reportNm.includes(item.report_name))
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
    const uniqueAuthorNameOptions = [
      ...new Set(filtersData.map((item) => item.author_name)),
    ];
    const uniqueLanguageOptions = [
      ...new Set(filtersData.map((item) => item.language)),
    ];
    const uniqueEntityOptions = [
      ...new Set(filtersData.map((item) => item.entity)),
    ];
    const uniqueStatusOptions = [
      ...new Set(filtersData.map((item) => item.status)),
    ];
    const uniqueReportNmOptions = [
      ...new Set(filtersData.map((item) => item.report_name)),
    ];

    // Update the state with the options
    setVrsRsidOptions(uniqueVrsRsidOptions);
    setAuthorNameOptions(uniqueAuthorNameOptions);
    setlanguageOptions(uniqueLanguageOptions);
    setEntityOptions(uniqueEntityOptions);
    setstatusOptions(uniqueStatusOptions);
    setReportNmOptions(uniqueReportNmOptions);
  };

  const isInitialMount = useRef(true);
  useEffect(() => {
    console.log(isInitialMount);
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Set default date range (past 2 days)
    const defaultEndDate = new Date();
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 8);
    defaultEndDate.setDate(defaultEndDate.getDate() - 1);

    // Initialize dateRange state with the default values
    setDateRange([defaultStartDate, defaultEndDate]);

    // Fetch data based on the default date range
    fetchData(formatDate(defaultStartDate), formatDate(defaultEndDate));
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <div className="w-100 clearfix">
      <div className="filters w-100 p-2 clearfix">
        <div className="filter-set-1 w-25 p-2 float-start">
          <label className="filterLabels" htmlFor="datePicker">
            Select Date Range:
          </label>
          <br />
          <DatePicker
            id="datePicker"
            showIcon
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
            }}
            shouldCloseOnSelect={true}
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

        <div className="filter-set-1 w-25 p-2 float-start">
          <label className="filterLabels" htmlFor="authorName">
            Select Author Name:
          </label>
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
            onChange={(selectedOptions) => {
              setSelectedAuthorName(selectedOptions);
              updateFilters("author_name", selectedOptions);
            }}
          />
        </div>

        <div className="filter-set-1 w-25 p-2 float-start">
          <label className="filterLabels" htmlFor="language">
            Select Language:
          </label>
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
            onChange={(selectedOptions) => {
              setSelectedlanguage(selectedOptions);
              updateFilters("language", selectedOptions);
            }}
          />
        </div>
      </div>
      <div className="filters w-100 p-2 clearfix">
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

        <div className="filter-set-2 w-25 p-2 float-start">
          <label className="filterLabels" htmlFor="status">
            Select Status:
          </label>
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
            onChange={(selectedOptions) => {
              setSelectedStatus(selectedOptions);
              updateFilters("status", selectedOptions);
            }}
          />
        </div>

        <div className="filter-set-2 w-25 p-2 float-start">
          <label className="filterLabels" htmlFor="reportNm">
            Select Report Name:
          </label>
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
            onChange={(selectedOptions) => {
              setSelectedReportNm(selectedOptions);
              updateFilters("report_name", selectedOptions);
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
              fetchData(formatDate(startDate), formatDate(endDate), true)
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
            <StatsComponent data={data} ed={formatDate(endDate)} />
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
