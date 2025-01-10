import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmmvDialogComponent } from './tmmv-dialog.component';

describe('TmmvDialogComponent', () => {
  let component: TmmvDialogComponent;
  let fixture: ComponentFixture<TmmvDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TmmvDialogComponent]
    });
    fixture = TestBed.createComponent(TmmvDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
