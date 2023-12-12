import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDoctorsComponent } from './add-doctors.component';

describe('AddDoctorsComponent', () => {
  let component: AddDoctorsComponent;
  let fixture: ComponentFixture<AddDoctorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDoctorsComponent]
    });
    fixture = TestBed.createComponent(AddDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
