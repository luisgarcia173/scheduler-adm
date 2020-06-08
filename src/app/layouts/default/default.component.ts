import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  sideBarOpen = true;
  currentTheme = 'light';
  bgClass = 'light-bg';

  constructor() { }

  ngOnInit(): void {
  }

  sideBarToggler(event: Event) {
    this.sideBarOpen = !this.sideBarOpen;
  }

  changeTheme(event) {
    this.currentTheme = event;
    this.bgClass = event + '-bg';
  }

}
