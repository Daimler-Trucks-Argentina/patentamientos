import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegSecDialogComponent } from './reg-sec-dialog.component';

describe('RegSecDialogComponent', () => {
  let component: RegSecDialogComponent;
  let fixture: ComponentFixture<RegSecDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegSecDialogComponent]
    });
    fixture = TestBed.createComponent(RegSecDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
