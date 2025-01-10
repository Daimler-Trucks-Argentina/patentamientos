import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleOfmmDialogComponent } from './multiple-ofmm-dialog.component';

describe('MultipleOfmmDialogComponent', () => {
  let component: MultipleOfmmDialogComponent;
  let fixture: ComponentFixture<MultipleOfmmDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultipleOfmmDialogComponent]
    });
    fixture = TestBed.createComponent(MultipleOfmmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
