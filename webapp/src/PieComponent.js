import React, { useEffect, useMemo, useState } from "react";
import * as Bootstrap from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import PieChart from "./PieChart";

const PieComponent = ({ data, filteredData }) => {
  const chartData = filteredData.length !== 0 ? filteredData : data;

  const calcPct = (elemKey, numsKey, data) => {
    const totals = data.reduce(
      (acc, { [numsKey]: nums }) => (nums ? acc + parseFloat(nums) : acc),
      0
    );

    const dataWithPercentage = data.reduce(
      (result, { [elemKey]: elem, [numsKey]: nums }) => {
        if (nums !== undefined && nums !== null) {
          const name = elem.toUpperCase();
          const y = (parseFloat(nums) * 100) / totals;
          const existingEntry = result.find((entry) => entry.name === name);

          if (existingEntry) {
            existingEntry.y += y;
          } else {
            result.push({ name, y, drilldown: elem });
          }
        }
        return result;
      },
      []
    );

    return dataWithPercentage;
  };

  const generateDrilldown = (data, mainKey, childKey, numKey) => {
    const result = Object.values(
      data.reduce((acc, item) => {
        const mainValue = item[mainKey];
        const childValue = item[childKey];
        const numValue = item[numKey];

        if (numValue !== undefined && numValue !== null) {
          const existingEntry = acc[mainValue];

          if (!existingEntry) {
            acc[mainValue] = { id: mainValue, data: [] };
          }

          const entityData = acc[mainValue];
          const existingIndex = entityData.data.findIndex(
            (entry) => entry[0] === childValue
          );

          if (existingIndex === -1) {
            entityData.data.push([childValue, parseFloat(numValue)]);
          } else {
            entityData.data[existingIndex][1] += parseFloat(numValue);
          }
        }

        return acc;
      }, {})
    ).map(({ id, data }) => ({
      id,
      data: data.map(([name, value]) => [name.toLowerCase(), value]),
    }));

    result.forEach((entity) => {
      const totalValues = entity.data.reduce(
        (acc, [name, value]) => acc + value,
        0
      );
      entity.data = entity.data.map(([name, value]) => [
        name,
        parseFloat(((value / totalValues) * 100).toFixed(2)),
      ]);
    });

    return result;
  };

  const [mainChartSize, setMainChartSize] = useState("65%");

  const drilldownDataPageViews = useMemo(
    () => generateDrilldown(chartData, "entity", "VrsRsid", "page_views"),
    [chartData]
  );
  const mainDataPageViews = useMemo(
    () => calcPct("entity", "page_views", chartData),
    [chartData]
  );

  const drilldownDataArticleViews = useMemo(
    () => generateDrilldown(chartData, "entity", "VrsRsid", "article_views"),
    [chartData]
  );
  const mainDataArticleViews = useMemo(
    () => calcPct("entity", "article_views", chartData),
    [chartData]
  );

  const drilldownDataVisits = useMemo(
    () => generateDrilldown(chartData, "entity", "VrsRsid", "visits"),
    [chartData]
  );
  const mainDataVisits = useMemo(
    () => calcPct("entity", "visits", chartData),
    [chartData]
  );

  const drilldownDataReturnVisits = useMemo(
    () => generateDrilldown(chartData, "entity", "VrsRsid", "return_visits"),
    [chartData]
  );
  const mainDataReturnVisits = useMemo(
    () => calcPct("entity", "return_visits", chartData),
    [chartData]
  );

  const drilldownDataAudioPlay = useMemo(
    () => generateDrilldown(chartData, "entity", "VrsRsid", "audio_play"),
    [chartData]
  );
  const mainDataAudioPlay = useMemo(
    () => calcPct("entity", "audio_play", chartData),
    [chartData]
  );

  const drilldownDataVideoPlay = useMemo(
    () => generateDrilldown(chartData, "entity", "VrsRsid", "video_play_e5"),
    [chartData]
  );
  const mainDataVideoPlay = useMemo(
    () => calcPct("entity", "video_play_e5", chartData),
    [chartData]
  );

  useEffect(() => {
    setMainChartSize(chartData === data ? "55%" : "50%");
  }, [chartData, data]);

  return (
    <div className="pies clearfix w-100 column">
      <div className="pies-01 clearfix w-100">
        <div className="pageviewsPie float-start" style={{ width: "33.33%" }}>
          <PieChart
            title="Page Views"
            center={["55%", "30%"]}
            size={mainChartSize}
            data={mainDataPageViews}
            drilldowns={drilldownDataPageViews}
          />
        </div>
        <div
          className="articleViewsPie float-start"
          style={{ width: "33.33%" }}
        >
          <PieChart
            title="Article Views"
            center={["50%", "30%"]}
            size={mainChartSize}
            data={mainDataArticleViews}
            drilldowns={drilldownDataArticleViews}
          />
        </div>
        <div className="visitsPie float-start" style={{ width: "33.33%" }}>
          <PieChart
            title="Visits"
            center={["55%", "30%"]}
            size={mainChartSize}
            data={mainDataVisits}
            drilldowns={drilldownDataVisits}
          />
        </div>
        {/* <div className="avgTimePie float-start w-25">
          <PieChart
            title="Avg. Time Spent on Site Per Visit"
            center={["50%", "30%"]}
            size="55%"
            data={mainDataAvgTime}
            drilldowns={drilldownDataAvgTime}
          />
        </div> */}
      </div>
      <div className="pies-02 clearfix w-100">
        <div
          className="returnVisitsPie float-start"
          style={{ width: "33.33%" }}
        >
          <PieChart
            title="Return Visits"
            center={["55%", "30%"]}
            size={mainChartSize}
            data={mainDataReturnVisits}
            drilldowns={drilldownDataReturnVisits}
          />
        </div>
        <div className="audioPlayPie float-start" style={{ width: "33.33%" }}>
          <PieChart
            title="Audio Play"
            center={["55%", "30%"]}
            size={mainChartSize}
            data={mainDataAudioPlay}
            drilldowns={drilldownDataAudioPlay}
          />
        </div>
        <div className="videoPlayPie float-start" style={{ width: "33.33%" }}>
          <PieChart
            title="Video Play"
            center={["55%", "30%"]}
            size={mainChartSize}
            data={mainDataVideoPlay}
            drilldowns={drilldownDataVideoPlay}
          />
        </div>
      </div>
    </div>
  );
};

export default PieComponent;
