import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyVersionDialogComponent } from './key-version-dialog.component';

describe('KeyVersionDialogComponent', () => {
  let component: KeyVersionDialogComponent;
  let fixture: ComponentFixture<KeyVersionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeyVersionDialogComponent]
    });
    fixture = TestBed.createComponent(KeyVersionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
