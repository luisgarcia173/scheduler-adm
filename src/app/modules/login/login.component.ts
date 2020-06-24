import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private permissionsService: NgxPermissionsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._initForm();
  }

  _initForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid || this.loginForm.pending) {
      const controls = this.loginForm.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    if (username === 'admin' && password === 'admin') {
      const perm = ['ADMIN', 'USER'];
      this.permissionsService.loadPermissions(perm);
      this.router.navigate(['']);
    }

  }

}
