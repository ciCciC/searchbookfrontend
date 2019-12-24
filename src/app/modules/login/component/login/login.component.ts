import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../../../../core/service/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  buttonDisabled: Observable<boolean>;

  constructor(private readonly form: FormBuilder, private readonly router: Router,
              private readonly authService: AuthService) {
    this.loginForm = this.form.group({
      username: new FormControl('admin', Validators.required),
      password: new FormControl('admin', Validators.required),
    });

    if (this.authService.isAuthenticated() && this.authService.isLoggedIn()) {
      this.toHomepage();
    }
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(value => {
        this.toHomepage();
        this.clear();
      }, error => console.log(error));
    }
  }

  private toHomepage() {
    this.router.navigate(['/home']);
  }

  private clear() {
    this.loginForm.reset();
  }

  ngOnInit() {
  }

}
