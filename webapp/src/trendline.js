import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const TrendLine = ({ dates, nm, trendData }) => {
  const addCommas = (x) =>
    x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  const options = useMemo(() => ({
    chart: {
      type: "areaspline",
      backgroundColor: "#283347",
      height: "30%",
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: dates,
      visible: false,
    },
    yAxis: {
      visible: false,
    },
    legend: {
      enabled: false,
    },
    accessibility: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      backgroundColor: "#283347",
      style: { color: "#fff" },
      formatter: function () {
        console.log(this);
        // let date_format = filters.group_by == 'day' ?
        //   moment(this.key).format('MMM DD, YYYY') :
        //   moment(this.key).format('MMM YYYY');
        let tooltip = `
              <span>${addCommas(this.y)}</span>`;
        return tooltip;
      },
      useHTML: true,
    },
    plotOptions: {
      series: {
        fillOpacity: 0,
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
            },
          },
        },
      },
    },
    series: [
      {
        name: nm,
        data: trendData,
      },
    ],
  }));

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default TrendLine;
