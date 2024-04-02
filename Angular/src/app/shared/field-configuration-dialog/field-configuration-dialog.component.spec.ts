import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldConfigurationDialogComponent } from './field-configuration-dialog.component';

describe('FieldConfigurationDialogComponent', () => {
  let component: FieldConfigurationDialogComponent;
  let fixture: ComponentFixture<FieldConfigurationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldConfigurationDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FieldConfigurationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
