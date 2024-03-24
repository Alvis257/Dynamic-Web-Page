import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlankFormComponent } from './blank-form.component';

describe('BlankFormComponent', () => {
  let component: BlankFormComponent;
  let fixture: ComponentFixture<BlankFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlankFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlankFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
