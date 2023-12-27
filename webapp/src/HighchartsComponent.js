// HighchartsComponent.js

import React, { useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const HighchartsComponent = ({ data }) => {
  console.log(data);
  useEffect(() => {
    if (data.length > 0) {
      // Use the filtered data to create Highcharts configuration
      const chartConfig = {
        // Your Highcharts configuration options here
        title: {
          text: "Filtered Data Chart",
        },
        series: [
          {
            name: "Sample Series",
            data: data.map((item) => item.article_views),
          },
        ],
      };

      // Create Highcharts chart
      Highcharts.chart("chart-container", chartConfig);
    }
  }, [data]);

  return <div id="chart-container"></div>;
};

export default HighchartsComponent;
