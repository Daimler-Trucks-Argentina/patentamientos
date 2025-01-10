import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateOfmmsDialogComponent } from './update-ofmms.component';


describe('UpdateOfmmsDialogComponent', () => {
  let component: UpdateOfmmsDialogComponent;
  let fixture: ComponentFixture<UpdateOfmmsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateOfmmsDialogComponent]
    });
    fixture = TestBed.createComponent(UpdateOfmmsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
