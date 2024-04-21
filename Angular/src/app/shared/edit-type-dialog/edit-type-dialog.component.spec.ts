import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTypeDialogComponent } from './edit-type-dialog.component';

describe('EditTypeDialogComponent', () => {
  let component: EditTypeDialogComponent;
  let fixture: ComponentFixture<EditTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTypeDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
