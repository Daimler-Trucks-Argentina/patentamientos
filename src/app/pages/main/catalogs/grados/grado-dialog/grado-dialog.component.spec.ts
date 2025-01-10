import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradoDialogComponent } from './grado-dialog.component';

describe('GradoDialogComponent', () => {
  let component: GradoDialogComponent;
  let fixture: ComponentFixture<GradoDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GradoDialogComponent]
    });
    fixture = TestBed.createComponent(GradoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
