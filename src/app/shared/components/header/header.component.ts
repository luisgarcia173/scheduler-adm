import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarAction: EventEmitter<any> = new EventEmitter();
  @Output() changeThemeHeaderAction: EventEmitter<any> = new EventEmitter();

  constructor(
    private permissionsService: NgxPermissionsService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  toggleSideBar() {
    this.toggleSideBarAction.emit();

    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

  changeThemeHeader(event: Event) {
    this.changeThemeHeaderAction.emit(event);
  }

  logout() {
    this.permissionsService.flushPermissions();
    this.router.navigate(['login']);
  }

  faq() {
    this.router.navigate(['faq']);
  }

}
