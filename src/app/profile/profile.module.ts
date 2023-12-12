import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileRoutes } from './profile-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewComponent } from './view/view.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { FormComponent } from './form/form.component';

@NgModule({
  declarations: [ViewComponent, FormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileRoutes),
    FormsModule,
    ReactiveFormsModule,
    // Specify ng-circle-progress as an import
    NgCircleProgressModule.forRoot({
      // set defaults here
      backgroundColor: 'white',
      backgroundPadding: 8,
      radius: 100,
      space: -15,
      maxPercent: 100,
      unitsColor: '#20c997',
      outerStrokeWidth: 7.5,
      outerStrokeColor: '#20c997',
      innerStrokeColor: 'white',
      innerStrokeWidth: 3,
      titleColor: '#20c997',
      subtitleColor: '#20c997',
    }),
  ],
})
export class ProfileModule {}
