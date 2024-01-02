import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import dayjs from "dayjs";
import "dayjs/locale/es";

const SplineChart = ({ title, dates, series }) => {
  dayjs.locale("en");
  const addCommas = (x) =>
    x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  const options = useMemo(
    () => ({
      chart: {
        type: "column",
        backgroundColor: "#283347",
        //   height: "45%",
      },
      title: {
        text: title,
        style: {
          color: "#fff",
        },
      },
      xAxis: {
        categories: dates,
        lineColor: "#fff",
        lineWidth: 3,
        labels: {
          style: {
            color: "#fff",
          },
        },
      },
      yAxis: [
        {
          gridLineColor: "#283347",
          lineColor: "#fff",
          lineWidth: 3,
          labels: {
            style: {
              color: "#fff",
            },
          },
          title: {
            text: "",
          },
          opposite: false, // Default position
        },
        {
          title: {
            text: "",
            color: "#fff",
          },
          opposite: true,
          gridLineColor: "#283347",
          lineColor: "#fff",
          lineWidth: 3,
          labels: {
            style: {
              color: "#fff",
            },
          },
        },
      ],
      legend: {
        itemStyle: {
          color: "#fff",
        },
      },
      accessibility: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        shared: false,
        backgroundColor: "#283347",
        style: { color: "#fff" },
        formatter: function () {
          const yFormat = this.point.series.name.includes("ma7")
            ? `${addCommas(Math.ceil(this.y))}`
            : addCommas(this.y);
          let tooltip = `
                  <span><u>${dayjs(this.key).format(
                    "MMM DD, YYYY"
                  )}</u></span><br/><br/>
                  <span><b>${this.point.series.name}</b>: ${yFormat}</span>`;
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
      series: series,
    }),
    [dates, series]
  );

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default SplineChart;
