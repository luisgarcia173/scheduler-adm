import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-widget-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  @Input() isLoading = false;

  constructor() { }

  ngOnInit(): void {
  }

}
