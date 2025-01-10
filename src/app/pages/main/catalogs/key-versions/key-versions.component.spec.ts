import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyVersionsComponent } from './key-versions.component';

describe('KeyVersionsComponent', () => {
  let component: KeyVersionsComponent;
  let fixture: ComponentFixture<KeyVersionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeyVersionsComponent]
    });
    fixture = TestBed.createComponent(KeyVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
