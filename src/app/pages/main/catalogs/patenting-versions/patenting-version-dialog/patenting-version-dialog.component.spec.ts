import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatentingVersionDialogComponent } from './patenting-version-dialog.component';

describe('PatentingVersionDialogComponent', () => {
  let component: PatentingVersionDialogComponent;
  let fixture: ComponentFixture<PatentingVersionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatentingVersionDialogComponent]
    });
    fixture = TestBed.createComponent(PatentingVersionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
