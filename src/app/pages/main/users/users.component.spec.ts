import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Page1Component } from './users.component';

describe('Page1Component', () => {
  let component: Page1Component;
  let fixture: ComponentFixture<Page1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Page1Component]
    });
    fixture = TestBed.createComponent(Page1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
