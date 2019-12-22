import { Component } from '@angular/core';
import {User} from '../shared/model/user';
import {AuthService} from '../core/service/auth/auth.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'searchbookfrontend';

  currentUser: Observable<User>;

  constructor(private router: Router,
              private readonly authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }
}
