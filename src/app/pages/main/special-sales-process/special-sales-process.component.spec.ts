import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialSalesProcessComponent } from './special-sales-process.component';

describe('SpecialSalesProcessComponent', () => {
  let component: SpecialSalesProcessComponent;
  let fixture: ComponentFixture<SpecialSalesProcessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialSalesProcessComponent]
    });
    fixture = TestBed.createComponent(SpecialSalesProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
