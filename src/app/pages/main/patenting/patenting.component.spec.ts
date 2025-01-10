import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatentingComponent } from './patenting.component';

describe('PatentingComponent', () => {
  let component: PatentingComponent;
  let fixture: ComponentFixture<PatentingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatentingComponent]
    });
    fixture = TestBed.createComponent(PatentingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
