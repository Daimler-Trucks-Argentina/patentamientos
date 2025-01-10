import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfmmsComponent } from './ofmms.component';

describe('OfmmsComponent', () => {
  let component: OfmmsComponent;
  let fixture: ComponentFixture<OfmmsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfmmsComponent]
    });
    fixture = TestBed.createComponent(OfmmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
