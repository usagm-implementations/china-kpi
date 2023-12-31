import React, { useEffect, useMemo } from "react";
import * as Bootstrap from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import TrendLine from "./trendline";
import "./App.css";

const LeaderboardComponent = ({ data, sd, ed }) => {
  //   const formatDate = (inputDate) => {
  //     inputDate = new Date(inputDate);
  //     return inputDate.toISOString().split("T")[0];
  //   };

  const getSums = (elem, val, properties, leaderData) => {
    const sumsMap = new Map();

    leaderData.forEach((item) => {
      const { [elem]: itemGroupValue, ...rest } = item;
      if (itemGroupValue === val) {
        if (!sumsMap.has(item.report_end_date)) {
          sumsMap.set(item.report_end_date, {
            date: item.report_end_date,
            field: val,
          });
        }

        properties.forEach((key) => {
          sumsMap.get(item.report_end_date)[key] =
            (sumsMap.get(item.report_end_date)[key] || 0) + (item[key] || 0);
        });
      }
    });

    const result = [...sumsMap.values()];

    result.forEach((item) => {
      const { return_visits, visits, article_views, page_views, field } = item;
      item.field = item.field.includes("cantonese")
        ? "Cantonese"
        : item.field.includes("mandarin")
        ? "Mandarin"
        : item.field.includes("uyghur")
        ? "Uyghur"
        : item.field;
      item.return_visit_rate = (return_visits / visits) * 100 || 0;
      item.conversion_rate = (article_views / page_views) * 100 || 0;
    });

    return result;
  };

  const transformData = (inputList, groupByKey, properties) => {
    inputList = inputList.sort((a, b) => new Date(a.date) - new Date(b.date));
    const groupedData = inputList.reduce((acc, item) => {
      const groupKey = item[groupByKey];

      if (!acc[groupKey]) {
        acc[groupKey] = { [groupByKey]: groupKey, dts: [] };
        properties.forEach((key) => {
          acc[groupKey][key] = { name: key, data: [] };
        });
      }

      acc[groupKey].dts.push(item.date);
      properties.forEach((key) => {
        acc[groupKey][key].data.push(item[key]);
      });

      return acc;
    }, {});

    return Object.values(groupedData);
  };

  let properties = [
    "page_views",
    "article_views",
    "visits",
    "return_visits",
    "audio_play",
    "video_play_e5",
  ];

  let newProperties = properties.push("return_visit_rate", "conversion_rate");
  const leaders = [];
  const RFATrend = transformData(
    getSums("entity", "RFA", properties, data),
    "field",
    properties
  ).pop();
  const VOATrend = transformData(
    getSums("entity", "VOA", properties, data),
    "field",
    properties
  ).pop();
  const RFACantoneseTrend = transformData(
    getSums("VrsRsid", "vrs_bbg1_rfacantoneseallsites", properties, data),
    "field",
    properties
  ).pop();
  const RFAMandarinTrend = transformData(
    getSums("VrsRsid", "vrs_bbg1_rfamandarinallsitesv", properties, data),
    "field",
    properties
  ).pop();
  const RFAUyghurTrend = transformData(
    getSums("VrsRsid", "vrs_bbg1_rfauyghurallsitesvrs", properties, data),
    "field",
    properties
  ).pop();
  const VOACantoneseTrend = transformData(
    getSums("VrsRsid", "vrs_bbg1_voacantoneseallsites", properties, data),
    "field",
    properties
  ).pop();
  const VOAMandarinTrend = transformData(
    getSums("VrsRsid", "vrs_bbg1_voamandarinallsitesv", properties, data),
    "field",
    properties
  ).pop();

  leaders.push(
    RFATrend,
    RFACantoneseTrend,
    RFAMandarinTrend,
    RFAUyghurTrend,
    VOATrend,
    VOACantoneseTrend,
    VOAMandarinTrend
  );
  //   leaders.forEach((d) => console.log(d.visits));

  return (
    <div className="leaderboards clearfix w-100 column">
      <h3 className="mt-1 ms-1" style={{ color: "#81b0d2" }}>
        <u>Leaderboard</u>
      </h3>
      <table className="table table-dark">
        <thead style={{ fontSize: "12px" }}>
          <tr>
            <th></th>
            <th>Page Views</th>
            <th>Article Views</th>
            <th>Conversion Rate</th>
            <th>Visits</th>
            <th>Return Visits</th>
            <th>Return Visit Rate</th>
            <th>Audio Play</th>
            <th>Video Play</th>
          </tr>
        </thead>
        <tbody style={{ fontSize: "15px" }}>
          {leaders.map((avg, index) => (
            <tr
              key={index}
              className={
                avg.field === "RFA" || avg.field === "VOA"
                  ? "highlight-row"
                  : ""
              }
            >
              <td className="text-center align-middle" style={{ width: "20%" }}>
                {avg.field}
              </td>
              <td style={{ width: "10%" }}>
                <TrendLine
                  dates={avg.dts}
                  nm={avg.page_views.name}
                  trendData={avg.page_views.data}
                />
              </td>
              <td style={{ width: "10%" }}>
                <TrendLine
                  dates={avg.dts}
                  nm={avg.article_views.name}
                  trendData={avg.article_views.data}
                />
              </td>
              <td style={{ width: "10%" }}>
                <TrendLine
                  dates={avg.dts}
                  nm={avg.conversion_rate.name}
                  trendData={avg.conversion_rate.data}
                />
              </td>
              <td style={{ width: "10%" }}>
                <TrendLine
                  dates={avg.dts}
                  nm={avg.return_visits.name}
                  trendData={avg.return_visits.data}
                />
              </td>
              <td style={{ width: "10%" }}>
                <TrendLine
                  dates={avg.dts}
                  nm={avg.return_visits.name}
                  trendData={avg.return_visits.data}
                />
              </td>
              <td style={{ width: "10%" }}>
                <TrendLine
                  dates={avg.dts}
                  nm={avg.return_visit_rate.name}
                  trendData={avg.return_visit_rate.data}
                />
              </td>
              <td style={{ width: "10%" }}>
                <TrendLine
                  dates={avg.dts}
                  nm={avg.audio_play.name}
                  trendData={avg.audio_play.data}
                />
              </td>
              <td style={{ width: "10%" }}>
                <TrendLine
                  dates={avg.dts}
                  nm={avg.video_play_e5.name}
                  trendData={avg.video_play_e5.data}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardComponent;
