import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractionsReportingComponent } from './extractions-reporting.component';

describe('ExtractionsReportingComponent', () => {
  let component: ExtractionsReportingComponent;
  let fixture: ComponentFixture<ExtractionsReportingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExtractionsReportingComponent]
    });
    fixture = TestBed.createComponent(ExtractionsReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
