import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkReportComponent } from './park-report.component';

describe('ParkReportComponent', () => {
  let component: ParkReportComponent;
  let fixture: ComponentFixture<ParkReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParkReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParkReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
