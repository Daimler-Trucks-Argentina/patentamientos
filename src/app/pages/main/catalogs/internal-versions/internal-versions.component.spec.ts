import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalVersionsComponent } from './internal-versions.component';

describe('InternalVersionsComponent', () => {
  let component: InternalVersionsComponent;
  let fixture: ComponentFixture<InternalVersionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternalVersionsComponent]
    });
    fixture = TestBed.createComponent(InternalVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
