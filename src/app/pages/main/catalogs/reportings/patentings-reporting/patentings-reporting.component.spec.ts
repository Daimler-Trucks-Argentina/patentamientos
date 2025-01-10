import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatentingsReportingComponent } from './patentings-reporting.component';

describe('PatentingsReportingComponent', () => {
  let component: PatentingsReportingComponent;
  let fixture: ComponentFixture<PatentingsReportingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatentingsReportingComponent]
    });
    fixture = TestBed.createComponent(PatentingsReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
