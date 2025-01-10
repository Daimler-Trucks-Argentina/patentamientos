import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalVersionSegmentationDialogComponent } from './internal-version-segmentation-dialog.component';

describe('InternalVersionSegmentationDialogComponent', () => {
  let component: InternalVersionSegmentationDialogComponent;
  let fixture: ComponentFixture<InternalVersionSegmentationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternalVersionSegmentationDialogComponent]
    });
    fixture = TestBed.createComponent(InternalVersionSegmentationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
