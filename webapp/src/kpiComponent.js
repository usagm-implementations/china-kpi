import React, { useEffect, useMemo } from "react";
import * as Bootstrap from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import SplineChart from "./spline";
import { getSums, transformData } from "./leaderboard";
import "./App.css";

const KPIComponent = ({ data }) => {
  //   console.log(sigh);
  const sortedData = data.sort(
    (a, b) => new Date(a.report_end_date) - new Date(b.report_end_date)
  );
  let properties = [
    "page_views",
    "article_views",
    "visits",
    "return_visits",
    "audio_play",
    "video_play_e5",
  ];

  let newProperties = [
    { prop: "page_views", color: "#DA70D6" },
    {
      prop: "page_views_ma7",
      color: "#DA70D6",
      type: "spline",
      linkedTo: ":previous",
    },
    { prop: "article_views", color: "#FFD700" },
    {
      prop: "article_views_ma7",
      color: "#FFD700",
      type: "spline",
      linkedTo: ":previous",
    },
    { prop: "visits", color: "#6B8E23" },
    {
      prop: "visits_ma7",
      color: "#6B8E23",
      type: "spline",
      linkedTo: ":previous",
    },
    { prop: "return_visits", color: "#FF7F50" },
    {
      prop: "return_visits_ma7",
      color: "#FF7F50",
      type: "spline",
      linkedTo: ":previous",
    },
    { prop: "audio_play", color: "#20B2AA", yAxis: 1 },
    {
      prop: "audio_play_ma7",
      color: "#20B2AA",
      type: "spline",
      yAxis: 1,
      linkedTo: ":previous",
    },
    { prop: "video_play_e5", color: "#FF8C00", yAxis: 1 },
    {
      prop: "video_play_e5_ma7",
      color: "#FF8C00",
      type: "spline",
      yAxis: 1,
      linkedTo: ":previous",
    },
  ];

  const RFATrend = transformData(
    getSums("entity", "RFA", properties, data, true),
    "field",
    newProperties
  ).pop();
  const RFASeries = {
    dts: RFATrend.dts,
    field: RFATrend.field,
    series: [
      RFATrend.page_views,
      RFATrend.page_views_ma7,
      RFATrend.article_views,
      RFATrend.article_views_ma7,
      RFATrend.visits,
      RFATrend.visits_ma7,
      RFATrend.return_visits,
      RFATrend.return_visits_ma7,
      RFATrend.audio_play,
      RFATrend.audio_play_ma7,
      RFATrend.video_play_e5,
      RFATrend.video_play_e5_ma7,
    ],
  };
  const VOATrend = transformData(
    getSums("entity", "VOA", properties, data, true),
    "field",
    newProperties
  ).pop();
  const VOASeries = {
    dts: VOATrend.dts,
    field: VOATrend.field,
    series: [
      VOATrend.page_views,
      VOATrend.page_views_ma7,
      VOATrend.article_views,
      VOATrend.article_views_ma7,
      VOATrend.visits,
      VOATrend.visits_ma7,
      VOATrend.return_visits,
      VOATrend.return_visits_ma7,
      VOATrend.audio_play,
      VOATrend.audio_play_ma7,
      VOATrend.video_play_e5,
      VOATrend.video_play_e5_ma7,
    ],
  };
  const RFACantoneseTrend = transformData(
    getSums("VrsRsid", "vrs_bbg1_rfacantoneseallsites", properties, data, true),
    "field",
    newProperties
  ).pop();
  const RFACantoneseSeries = {
    dts: RFACantoneseTrend.dts,
    field: RFACantoneseTrend.field,
    series: [
      RFACantoneseTrend.page_views,
      RFACantoneseTrend.page_views_ma7,
      RFACantoneseTrend.article_views,
      RFACantoneseTrend.article_views_ma7,
      RFACantoneseTrend.visits,
      RFACantoneseTrend.visits_ma7,
      RFACantoneseTrend.return_visits,
      RFACantoneseTrend.return_visits_ma7,
      RFACantoneseTrend.audio_play,
      RFACantoneseTrend.audio_play_ma7,
      RFACantoneseTrend.video_play_e5,
      RFACantoneseTrend.video_play_e5_ma7,
    ],
  };
  const RFAMandarinTrend = transformData(
    getSums("VrsRsid", "vrs_bbg1_rfamandarinallsitesv", properties, data, true),
    "field",
    newProperties
  ).pop();
  const RFAMandarinSeries = {
    dts: RFAMandarinTrend.dts,
    field: RFAMandarinTrend.field,
    series: [
      RFAMandarinTrend.page_views,
      RFAMandarinTrend.page_views_ma7,
      RFAMandarinTrend.article_views,
      RFAMandarinTrend.article_views_ma7,
      RFAMandarinTrend.visits,
      RFAMandarinTrend.visits_ma7,
      RFAMandarinTrend.return_visits,
      RFAMandarinTrend.return_visits_ma7,
      RFAMandarinTrend.audio_play,
      RFAMandarinTrend.audio_play_ma7,
      RFAMandarinTrend.video_play_e5,
      RFAMandarinTrend.video_play_e5_ma7,
    ],
  };
  const RFAUyghurTrend = transformData(
    getSums("VrsRsid", "vrs_bbg1_rfauyghurallsitesvrs", properties, data, true),
    "field",
    newProperties
  ).pop();
  const RFAUyghurSeries = {
    dts: RFAUyghurTrend.dts,
    field: RFAUyghurTrend.field,
    series: [
      RFAUyghurTrend.page_views,
      RFAUyghurTrend.page_views_ma7,
      RFAUyghurTrend.article_views,
      RFAUyghurTrend.article_views_ma7,
      RFAUyghurTrend.visits,
      RFAUyghurTrend.visits_ma7,
      RFAUyghurTrend.return_visits,
      RFAUyghurTrend.return_visits_ma7,
      RFAUyghurTrend.audio_play,
      RFAUyghurTrend.audio_play_ma7,
      RFAUyghurTrend.video_play_e5,
      RFAUyghurTrend.video_play_e5_ma7,
    ],
  };
  const VOACantoneseTrend = transformData(
    getSums("VrsRsid", "vrs_bbg1_voacantoneseallsites", properties, data, true),
    "field",
    newProperties
  ).pop();
  const VOACantoneseSeries = {
    dts: VOACantoneseTrend.dts,
    field: VOACantoneseTrend.field,
    series: [
      VOACantoneseTrend.page_views,
      VOACantoneseTrend.page_views_ma7,
      VOACantoneseTrend.article_views,
      VOACantoneseTrend.article_views_ma7,
      VOACantoneseTrend.visits,
      VOACantoneseTrend.visits_ma7,
      VOACantoneseTrend.return_visits,
      VOACantoneseTrend.return_visits_ma7,
      VOACantoneseTrend.audio_play,
      VOACantoneseTrend.audio_play_ma7,
      VOACantoneseTrend.video_play_e5,
      VOACantoneseTrend.video_play_e5_ma7,
    ],
  };
  const VOAMandarinTrend = transformData(
    getSums("VrsRsid", "vrs_bbg1_voamandarinallsitesv", properties, data, true),
    "field",
    newProperties
  ).pop();
  const VOAMandarinSeries = {
    dts: VOAMandarinTrend.dts,
    field: VOAMandarinTrend.field,
    series: [
      VOAMandarinTrend.page_views,
      VOAMandarinTrend.page_views_ma7,
      VOAMandarinTrend.article_views,
      VOAMandarinTrend.article_views_ma7,
      VOAMandarinTrend.visits,
      VOAMandarinTrend.visits_ma7,
      VOAMandarinTrend.return_visits,
      VOAMandarinTrend.return_visits_ma7,
      VOAMandarinTrend.audio_play,
      VOAMandarinTrend.audio_play_ma7,
      VOAMandarinTrend.video_play_e5,
      VOAMandarinTrend.video_play_e5_ma7,
    ],
  };

  return (
    <div className="kpiTrends clearfix w-100 column">
      <h3 className="mt-1 ms-1" style={{ color: "#81b0d2" }}>
        <u>KPI Trends</u>
      </h3>
      <div className="clearfix w-100 column">
        <div className="clearfix w-100 column">
          <div className="w-100 rfa">
            <SplineChart
              title={RFASeries.field}
              dates={RFASeries.dts}
              series={RFASeries.series}
            />
          </div>
        </div>
        <div className="clearfix w-100 column">
          <div className="rfa-cantonese float-start" style={{ width: "33%" }}>
            <SplineChart
              title={RFACantoneseSeries.field}
              dates={RFACantoneseSeries.dts}
              series={RFACantoneseSeries.series}
            />
          </div>
          <div className="rfa-mandarin float-start" style={{ width: "33%" }}>
            <SplineChart
              title={RFAMandarinSeries.field}
              dates={RFAMandarinSeries.dts}
              series={RFAMandarinSeries.series}
            />
          </div>
          <div className="rfa-Uyghur float-start" style={{ width: "33%" }}>
            <SplineChart
              title={RFAUyghurSeries.field}
              dates={RFAUyghurSeries.dts}
              series={RFAUyghurSeries.series}
            />
          </div>
        </div>
        <div className="clearfix w-100 column">
          <div className="w-100 voa">
            <SplineChart
              title={VOASeries.field}
              dates={VOASeries.dts}
              series={VOASeries.series}
            />
          </div>
        </div>
        <div className="clearfix w-100 column">
          <div className="voa-cantonese float-start" style={{ width: "50%" }}>
            <SplineChart
              title={VOACantoneseSeries.field}
              dates={VOACantoneseSeries.dts}
              series={VOACantoneseSeries.series}
            />
          </div>
          <div className="voa-mandarin float-start" style={{ width: "50%" }}>
            <SplineChart
              title={VOAMandarinSeries.field}
              dates={VOAMandarinSeries.dts}
              series={VOAMandarinSeries.series}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIComponent;
