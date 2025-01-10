import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileListViewComponent } from './file-list-view-dialog.component';

describe('FileListViewComponent', () => {
  let component: FileListViewComponent;
  let fixture: ComponentFixture<FileListViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileListViewComponent]
    });
    fixture = TestBed.createComponent(FileListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
