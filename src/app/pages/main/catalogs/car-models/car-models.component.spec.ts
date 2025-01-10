import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarModelsComponent } from './car-models.component';

describe('CarModelsComponent', () => {
  let component: CarModelsComponent;
  let fixture: ComponentFixture<CarModelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarModelsComponent]
    });
    fixture = TestBed.createComponent(CarModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
