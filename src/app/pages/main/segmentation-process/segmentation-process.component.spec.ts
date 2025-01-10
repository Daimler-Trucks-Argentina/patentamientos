import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentationProcessComponent } from './segmentation-process.component';

describe('SegmentationProcessComponent', () => {
  let component: SegmentationProcessComponent;
  let fixture: ComponentFixture<SegmentationProcessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SegmentationProcessComponent]
    });
    fixture = TestBed.createComponent(SegmentationProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
