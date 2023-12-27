import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import * as Bootstrap from "react-bootstrap";
import DatePicker from "react-datepicker";
import MultiSelect from "react-select";
import HighchartsComponent from "./HighchartsComponent";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const formatDate = (inputDate) => {
  const date = new Date(inputDate);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const App = () => {
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [vrsRsidOptions, setVrsRsidOptions] = useState([]);
  const [authorNameOptions, setAuthorNameOptions] = useState([]);
  const [languageOptions, setlanguageOptions] = useState([]);
  const [entityOptions, setEntityOptions] = useState([]);
  const [statusOptions, setstatusOptions] = useState([]);
  const [reportNmOptions, setReportNmOptions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    vrsRsid: [],
    authorName: [],
    language: [],
    entity: [],
    status: [],
    reportNm: [],
  });

  const fetchData = useCallback(
    async (sd, ed, filters = false) => {
      try {
        const response = await axios.get("http://localhost:7778/api/query", {
          params: {
            startDate: sd,
            endDate: ed,
          },
        });

        if (!filters) {
          const uniqueOptions = [
            "VrsRsid",
            "author_name",
            "language",
            "entity",
            "status",
            "report_name",
          ].reduce((options, key) => {
            options[key] = [...new Set(response.data.map((item) => item[key]))];
            return options;
          }, {});

          setVrsRsidOptions(uniqueOptions.VrsRsid);
          setAuthorNameOptions(uniqueOptions.author_name);
          setlanguageOptions(uniqueOptions.language);
          setEntityOptions(uniqueOptions.entity);
          setstatusOptions(uniqueOptions.status);
          setReportNmOptions(uniqueOptions.report_name);
        }

        setData(response.data);

        if (filters) {
          const newFilters = Object.keys(selectedFilters).reduce(
            (filters, key) => {
              filters[key] = selectedFilters[key].map((option) => option.value);
              return filters;
            },
            {}
          );

          const filteredData = response.data.filter((item) =>
            Object.keys(newFilters).every(
              (key) =>
                !newFilters[key].length || newFilters[key].includes(item[key])
            )
          );

          setFilteredData(filteredData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [selectedFilters]
  );

  const updateFilters = (elem, selectedOptions) => {
    const selectData = filteredData.length !== 0 ? filteredData : data;
    const filtersData = selectData.filter((d) =>
      selectedOptions.some((x) => d[elem] === x.value)
    );

    const uniqueOptions = [
      "VrsRsid",
      "author_name",
      "language",
      "entity",
      "status",
      "report_name",
    ].reduce((options, key) => {
      options[key] = [...new Set(filtersData.map((item) => item[key]))];
      return options;
    }, {});

    setVrsRsidOptions(uniqueOptions.VrsRsid);
    setAuthorNameOptions(uniqueOptions.author_name);
    setlanguageOptions(uniqueOptions.language);
    setEntityOptions(uniqueOptions.entity);
    setstatusOptions(uniqueOptions.status);
    setReportNmOptions(uniqueOptions.report_name);
  };

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const defaultEndDate = new Date();
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 2);

    setDateRange([defaultStartDate, defaultEndDate]);
    fetchData(formatDate(defaultStartDate), formatDate(defaultEndDate));
  }, [fetchData]);

  const [startDate, endDate] = dateRange;

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
            value={selectedFilters.vrsRsid}
            onChange={(selectedOptions) => {
              setSelectedFilters({
                ...selectedFilters,
                vrsRsid: selectedOptions,
              });
              updateFilters("VrsRsid", selectedOptions);
            }}
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
            value={selectedFilters.authorName}
            onChange={(selectedOptions) => {
              setSelectedFilters({
                ...selectedFilters,
                authorName: selectedOptions,
              });
              updateFilters("author_name", selectedOptions);
            }}
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
            value={selectedFilters.language}
            onChange={(selectedOptions) => {
              setSelectedFilters({
                ...selectedFilters,
                language: selectedOptions,
              });
              updateFilters("language", selectedOptions);
            }}
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
            value={selectedFilters.entity}
            onChange={(selectedOptions) => {
              setSelectedFilters({
                ...selectedFilters,
                entity: selectedOptions,
              });
              updateFilters("entity", selectedOptions);
            }}
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
            value={selectedFilters.status}
            onChange={(selectedOptions) => {
              setSelectedFilters({
                ...selectedFilters,
                status: selectedOptions,
              });
              updateFilters("status", selectedOptions);
            }}
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
            value={selectedFilters.reportNm}
            onChange={(selectedOptions) => {
              setSelectedFilters({
                ...selectedFilters,
                reportNm: selectedOptions,
              });
              updateFilters("report_name", selectedOptions);
            }}
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
              fetchData(formatDate(startDate), formatDate(endDate), true)
            }
          >
            Select Filters
          </Bootstrap.Button>
        </div>
      </div>
      <div>
        <HighchartsComponent data={filteredData} />
      </div>
    </div>
  );
};

export default App;
