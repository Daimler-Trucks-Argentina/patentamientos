import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegSecsComponent } from './reg-secs.component';

describe('RegSecsComponent', () => {
  let component: RegSecsComponent;
  let fixture: ComponentFixture<RegSecsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegSecsComponent]
    });
    fixture = TestBed.createComponent(RegSecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
