import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WholesaleVersionsDialogComponent } from './wholesale-versions-dialog.component';

describe('WholesaleVersionsDialogComponent', () => {
  let component: WholesaleVersionsDialogComponent;
  let fixture: ComponentFixture<WholesaleVersionsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WholesaleVersionsDialogComponent]
    });
    fixture = TestBed.createComponent(WholesaleVersionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
