import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFieldDialogComponent } from './new-field-dialog.component';

describe('NewFieldDialogComponent', () => {
  let component: NewFieldDialogComponent;
  let fixture: ComponentFixture<NewFieldDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewFieldDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewFieldDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
