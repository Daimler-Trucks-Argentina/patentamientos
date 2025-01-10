import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatentingVersionsComponent } from './patenting-versions.component';

describe('PatentingVersionsComponent', () => {
  let component: PatentingVersionsComponent;
  let fixture: ComponentFixture<PatentingVersionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatentingVersionsComponent]
    });
    fixture = TestBed.createComponent(PatentingVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
