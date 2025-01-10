import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarModelDialogComponent } from './car-model-dialog.component';

describe('CarModelDialogComponent', () => {
  let component: CarModelDialogComponent;
  let fixture: ComponentFixture<CarModelDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarModelDialogComponent]
    });
    fixture = TestBed.createComponent(CarModelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
