import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalVersionDialogComponent } from './internal-version-dialog.component';

describe('InternalVersionDialogComponent', () => {
  let component: InternalVersionDialogComponent;
  let fixture: ComponentFixture<InternalVersionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternalVersionDialogComponent]
    });
    fixture = TestBed.createComponent(InternalVersionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
