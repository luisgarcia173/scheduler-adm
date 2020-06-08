import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-widget-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss']
})
export class ThemePickerComponent implements OnInit {

  @Output() changeThemeAction: EventEmitter<any> = new EventEmitter();
  currentTheme = '';
  themes = [
    { key: 'default', label: 'Default', property: 'soft' },
    { key: 'light', label: 'Light Blue', property: 'soft' },
    { key: 'green', label: 'Green Scale', property: 'soft' },
    { key: 'dark', label: 'Dark Yellow', property: 'dark' },
    { key: 'alternative', label: 'Dark Wine', property: 'dark' },
  ];

  constructor() { }

  ngOnInit(): void {
    this.currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'default';
  }

  changeTheme(theme: string) {
    this.currentTheme = theme;
    this.changeThemeAction.emit(theme);
    localStorage.setItem('theme', theme);
  }

}
