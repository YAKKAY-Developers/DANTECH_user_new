import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CommonModule,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FullComponent } from './layouts/full/full.component';
import { NavigationComponent } from './shared/header/navigation.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner.component';
import { BlankComponent } from './layouts/blank/blank.component';

import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  declarations: [AppComponent, SpinnerComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot(Approutes, { useHash: false }),
    FullComponent,
    BlankComponent,
    NavigationComponent,
    SidebarComponent,
    NgCircleProgressModule.forRoot({
      // set defaults here
      backgroundColor: 'teal',
      backgroundPadding: 8,
      radius: 60,
      space: -15,
      maxPercent: 100,
      unitsColor: '#ffffff',
      outerStrokeWidth: 7.5,
      outerStrokeColor: 'white',
      innerStrokeColor: 'teal',
      innerStrokeWidth: 3,
      titleColor: '#ffffff',
      subtitleColor: '#ffffff',
    }),
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
