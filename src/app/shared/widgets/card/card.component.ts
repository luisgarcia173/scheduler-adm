import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

@Component({
  selector: 'app-widget-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() element: CardElement;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

}

export interface CardElement {
  title: string;
  icon: string;
  value: string;
  of: string;
  percentage: string;
  description: string;
  detail: string;
}
