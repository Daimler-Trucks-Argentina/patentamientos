import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoriesComponent } from './factories.component';

describe('FactoriesComponent', () => {
  let component: FactoriesComponent;
  let fixture: ComponentFixture<FactoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FactoriesComponent]
    });
    fixture = TestBed.createComponent(FactoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
