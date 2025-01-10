import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalVersionSegmentationsComponent } from './internal-version-segmentations.component';

describe('InternalVersionSegmentationsComponent', () => {
  let component: InternalVersionSegmentationsComponent;
  let fixture: ComponentFixture<InternalVersionSegmentationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternalVersionSegmentationsComponent]
    });
    fixture = TestBed.createComponent(InternalVersionSegmentationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
