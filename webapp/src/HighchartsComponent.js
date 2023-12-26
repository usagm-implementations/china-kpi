import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";

const HighchartsComponent = () => {
  useEffect(() => {
    // Sample Highcharts configuration
    const options = {
      chart: {
        type: "bar",
      },
      title: {
        text: "Highcharts Example",
      },
      series: [
        {
          data: [1, 2, 3, 4, 5],
        },
      ],
      accessibility: {
        enabled: false,
      },
    };

    // Render Highcharts chart
    Highcharts.chart("highcharts-container", options);
  }, []);

  return <div id="highcharts-container" />;
};

export default HighchartsComponent;
