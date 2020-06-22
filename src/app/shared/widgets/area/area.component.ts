import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

@Component({
  selector: 'app-widget-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

  @Input() element: AreaElement;

  chartOptions: {};
  Highcharts = Highcharts;

  constructor() { }

  ngOnInit(): void {
    this.chartOptions = {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Daily Schedule'
      },
      subtitle: {
        text: 'Source: Valecard registered jobs'
      },
      xAxis: {
        categories: this.element.categories
      },
      yAxis: {
        title: {
          text: 'Execution Log'
        }
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: true,
      },
      plotOptions: {
        area: {
          stacking: 'normal',
          lineColor: '#666666',
          lineWidth: 1,
          marker: {
            lineWidth: 1,
            lineColor: '#666666'
          }
        }
      },
      series: this.element.content
    };

    HC_exporting(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

}

export interface AreaElement {
  categories: string[];
  content: ElementData[];
}

export interface ElementData {
  name: string;
  data: string[];
}
