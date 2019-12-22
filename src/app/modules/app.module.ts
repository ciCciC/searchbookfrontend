import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../shared/material/material.module';
import {LoginComponent} from './login/component/login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HomeComponent} from './home/component/home/home.component';
import {TopbarComponent} from './topbar/component/topbar/topbar.component';
import {HttpClientModule} from '@angular/common/http';
import {PageNotFoundComponent} from './errorhandler/component/page-not-found/page-not-found.component';
import { SearchResultComponent } from './home/component/search-result/search-result.component';
import { SimpelRendererComponent } from './gfx/component/simpel-renderer/simpel-renderer.component';
import { RenderCubesComponent } from './gfx/component/render-cubes/render-cubes.component';
import { RenderBooksComponent } from './gfx/component/render-books/render-books.component';
import { RenderAmazonBooksComponent } from './gfx/component/render-amazon-books/render-amazon-books.component';
import { SearchBarComponent } from './home/component/search-bar/search-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    TopbarComponent,
    PageNotFoundComponent,
    SearchResultComponent,
    SimpelRendererComponent,
    RenderCubesComponent,
    RenderBooksComponent,
    RenderAmazonBooksComponent,
    SearchBarComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
