import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfmmDialogComponent } from './ofmm-dialog.component';

describe('OfmmDialogComponent', () => {
  let component: OfmmDialogComponent;
  let fixture: ComponentFixture<OfmmDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfmmDialogComponent]
    });
    fixture = TestBed.createComponent(OfmmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
