import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesProcessComponent } from './sales-process.component';

describe('SalesProcessComponent', () => {
  let component: SalesProcessComponent;
  let fixture: ComponentFixture<SalesProcessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesProcessComponent]
    });
    fixture = TestBed.createComponent(SalesProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
