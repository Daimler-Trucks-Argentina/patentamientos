import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WholeSalesVersionsComponent } from './wholesale-versions.component';

describe('WholeSalesVersionsComponent', () => {
  let component: WholeSalesVersionsComponent;
  let fixture: ComponentFixture<WholeSalesVersionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WholeSalesVersionsComponent]
    });
    fixture = TestBed.createComponent(WholeSalesVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
