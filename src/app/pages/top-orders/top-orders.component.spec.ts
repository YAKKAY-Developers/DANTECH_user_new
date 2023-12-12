import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopOrdersComponent } from './top-orders.component';

describe('TopOrdersComponent', () => {
  let component: TopOrdersComponent;
  let fixture: ComponentFixture<TopOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopOrdersComponent]
    });
    fixture = TestBed.createComponent(TopOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
