import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/component/login/login.component';
import {Role} from '../shared/model/role';
import {HomeComponent} from './home/component/home/home.component';
import {AuthGuard} from '../core/guard/auth.guard';
import {PageNotFoundComponent} from './errorhandler/component/page-not-found/page-not-found.component';
import {SimpelRendererComponent} from './gfx/component/simpel-renderer/simpel-renderer.component';
import {RenderCubesComponent} from './gfx/component/render-cubes/render-cubes.component';
import {RenderAmazonBooksComponent} from './gfx/component/render-amazon-books/render-amazon-books.component';
import {SearchBarComponent} from './home/component/search-bar/search-bar.component';


const routes: Routes = [
  { path: '', redirectTo: '/rendercube', pathMatch: 'full' },
  { path: 'rendercube', component: RenderCubesComponent },
  { path: 'simpelrenderer', component: SimpelRendererComponent },
  { path: 'amazonbooks', component: RenderAmazonBooksComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'searchbar', component: SearchBarComponent },
  // { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: {roles: [Role.ADMIN]} },
  { path: '**', component: PageNotFoundComponent }
  // { path: '**', redirectTo: 'home', canActivate: [AuthGuard], data: {roles: [Role.ADMIN]}  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
