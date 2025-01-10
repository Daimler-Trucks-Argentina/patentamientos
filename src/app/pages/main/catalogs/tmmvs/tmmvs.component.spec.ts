import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmmvsComponent } from './tmmvs.component';

describe('TmmvsComponent', () => {
  let component: TmmvsComponent;
  let fixture: ComponentFixture<TmmvsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TmmvsComponent]
    });
    fixture = TestBed.createComponent(TmmvsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
