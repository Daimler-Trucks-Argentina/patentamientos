import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatentingViewDialogComponent } from './patenting-view-dialog.component';

describe('PatentingViewDialogComponent', () => {
  let component: PatentingViewDialogComponent;
  let fixture: ComponentFixture<PatentingViewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatentingViewDialogComponent]
    });
    fixture = TestBed.createComponent(PatentingViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
