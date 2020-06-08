import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  sideBarOpen = true;
  currentTheme = '';
  bgClass = '';

  constructor() { }

  ngOnInit(): void {
    this.currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'default';
    this._setThemeBg();
  }

  sideBarToggler(event: Event) {
    this.sideBarOpen = !this.sideBarOpen;
  }

  changeTheme(event) {
    this.currentTheme = event;
    this._setThemeBg();
  }

  private _setThemeBg() {
    this.bgClass = this.currentTheme + '-bg';
  }

}
