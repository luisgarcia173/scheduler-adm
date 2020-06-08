import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-widget-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss']
})
export class ThemePickerComponent implements OnInit {

  @Output() changeThemeAction: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  changeTheme(theme: string) {
    this.changeThemeAction.emit(theme);
    localStorage.setItem('theme', theme);
  }

}
