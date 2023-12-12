import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexXAxis,
  ApexTooltip,
  ApexTheme,
  ApexGrid,
  ApexPlotOptions
} from 'ng-apexcharts';

export type salesChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  yaxis: ApexYAxis | any;
  stroke: any;
  theme: ApexTheme | any;
  tooltip: ApexTooltip | any;
  dataLabels: ApexDataLabels | any;
  legend: ApexLegend | any;
  colors: string[] | any;
  markers: any;
  grid: ApexGrid | any;
  plotOptions: ApexPlotOptions |any;
};
export type ChartDataItem = {
  name: string;
  data: number[];
};

@Component({
  selector: 'app-sales-ratio',
  templateUrl: './sales-ratio.component.html'
})
export class SalesRatioComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent = Object.create(null);
  public salesChartOptions: Partial<salesChartOptions>;
  constructor() {
    this.salesChartOptions = {
      series: [
        {
          name: "2020",
          data: [20, 40, 50, 30, 40, 50, 30, 30, 40, 20, 30, 15],
        },
        {
          name: "2022",
          data: [10, 20, 40, 60, 20, 40, 60, 60, 20, 30, 40, 35],
        },
      ],
      chart: {
        fontFamily: 'Rubik,sans-serif',
        height: 265,
        type: 'bar',
        toolbar: {
          show: false
        },
        stacked: false,
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
          barHeight: '70%',
          borderRadius: 3,
        },
      },
      colors: ["#0d6efd", "#009efb", "#6771dc"],
      stroke: {
        show: true,
        width: 4,
        colors: ["transparent"],
      },
      grid: {
        strokeDashArray: 3,
      },
      markers: {
        size: 3
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
      },
      tooltip: {
        theme: 'dark'
      }
    };
  }

  exportToCSV() {
    const data: ChartDataItem[] = this.salesChartOptions.series; // Use the defined type
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add the CSV header with column names
    csvContent += "Year,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec\n";

    // Convert data to CSV format
    data.forEach((item: ChartDataItem) => {
      csvContent += item.name + "," + item.data.join(",") + "\n";
    });

    // Create a data URI for the CSV content
    const encodedUri = encodeURI(csvContent);

    // Create a link and trigger the download
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_data.csv");
    link.click();
  }


  ngOnInit(): void {
  }

}
