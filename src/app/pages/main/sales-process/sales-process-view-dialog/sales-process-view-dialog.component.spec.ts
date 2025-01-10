import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesProcessViewDialogComponent } from './sales-process-view-dialog.component';

describe('SalesProcessViewDialogComponent', () => {
  let component: SalesProcessViewDialogComponent;
  let fixture: ComponentFixture<SalesProcessViewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesProcessViewDialogComponent]
    });
    fixture = TestBed.createComponent(SalesProcessViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
