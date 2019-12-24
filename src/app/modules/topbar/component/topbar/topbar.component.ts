import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../../../../shared/model/user';
import {Router} from '@angular/router';
import {AuthService} from '../../../../core/service/auth/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  title = 'search-books webapp';
  currentUser: Observable<User>;

  constructor(private router: Router, private readonly authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  routeHome() {
    this.router.navigateByUrl('/home');
  }

  ngOnInit() {
  }

}
