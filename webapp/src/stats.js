import React, { useEffect, useMemo } from "react";
import * as Bootstrap from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const StatsComponent = ({ data, ed }) => {
  const formatDate = (inputDate) => {
    inputDate = new Date(inputDate);
    return inputDate.toISOString().split("T")[0];
  };

  //   const formatToDateString = (inputDate) => {
  //     inputDate = new Date(`${inputDate}T00:00:00Z`);
  //     return inputDate.toLocaleDateString("en-US", {
  //       ...{ month: "short", day: "numeric", year: "numeric" },
  //       timeZone: "UTC",
  //     });
  //   };

  const averages = (elem, val, properties, statsData, languageEntity = "") => {
    const elemData = statsData.filter(
      (sd) => formatDate(sd.report_end_date) === ed && sd[elem] === val
    );
    // console.log(elemData);
    var { sum, count } = elemData.reduce(
      (acc, obj) => {
        if (
          properties.every(
            (prop) => obj[prop] !== undefined && obj[prop] !== null
          )
        ) {
          properties.forEach((prop) => {
            acc.sum[prop] += obj[prop];
          });
          acc.count += 1;
        }
        return acc;
      },
      { sum: Object.fromEntries(properties.map((prop) => [prop, 0])), count: 0 }
    );
    val = val.includes("cantonese")
      ? "Cantonese"
      : val.includes("mandarin")
      ? "Mandarin"
      : val.includes("uyghur")
      ? "Uyghur"
      : val;
    // Calculate the averages
    var averages = { val };
    properties.forEach((prop) => {
      averages[prop] = count > 0 ? sum[prop] / count : undefined;
      if (prop === "avg_time_spent_on_site_per_visit")
        averages[prop] = averages[prop].toFixed(2);
      else averages[prop] = Math.ceil(averages[prop]);
    });

    return averages;
  };

  let properties = [
    "page_views",
    "article_views",
    "visits",
    // "avg_time_spent_on_site_per_visit",
    "return_visits",
    "audio_play",
    "video_play_e5",
  ];
  const allAvgs = [];
  const RFAAvg = averages("entity", "RFA", properties, data);
  const VOAAvg = averages("entity", "VOA", properties, data);
  const rfaCantoneseAvg = averages(
    "VrsRsid",
    "vrs_bbg1_rfacantoneseallsites",
    properties,
    data
  );
  const rfaMandarinAvg = averages(
    "VrsRsid",
    "vrs_bbg1_rfamandarinallsitesv",
    properties,
    data
  );
  const rfaUyghurAvg = averages(
    "VrsRsid",
    "vrs_bbg1_rfauyghurallsitesvrs",
    properties,
    data
  );
  const voaCantoneseAvg = averages(
    "VrsRsid",
    "vrs_bbg1_voacantoneseallsites",
    properties,
    data
  );
  const voaMandarinAvg = averages(
    "VrsRsid",
    "vrs_bbg1_voamandarinallsitesv",
    properties,
    data
  );

  allAvgs.push(
    RFAAvg,
    rfaCantoneseAvg,
    rfaMandarinAvg,
    rfaUyghurAvg,
    VOAAvg,
    voaCantoneseAvg,
    voaMandarinAvg
  );
  console.log(allAvgs);

  return (
    <div className="avgs clearfix w-100 column">
      <h4 className="mt-1 ms-1">
        <u>Average Stats on {ed}</u>
      </h4>
      <br />
      <table className="table table-dark">
        <thead style={{ fontSize: "12px" }}>
          <tr>
            <th></th>
            <th>Page Views</th>
            <th>Article Views</th>
            <th>Visits</th>
            <th>Return Visits</th>
            <th>Audio Play</th>
            <th>Video Play</th>
          </tr>
        </thead>
        <tbody style={{ fontSize: "11px" }}>
          {allAvgs.map((avg, index) => (
            <tr
              key={index}
              className={
                avg.val === "RFA" || avg.val === "VOA" ? "highlight-row" : ""
              }
            >
              <td>{avg.val}</td>
              <td>{avg.page_views}</td>
              <td>{avg.article_views}</td>
              <td>{avg.visits}</td>
              <td>{avg.return_visits}</td>
              <td>{avg.audio_play}</td>
              <td>{avg.video_play_e5}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatsComponent;
