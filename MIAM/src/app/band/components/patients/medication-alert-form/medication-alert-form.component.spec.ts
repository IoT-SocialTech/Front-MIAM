import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationAlertFormComponent } from './medication-alert-form.component';

describe('MedicationAlertFormComponent', () => {
  let component: MedicationAlertFormComponent;
  let fixture: ComponentFixture<MedicationAlertFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicationAlertFormComponent]
    });
    fixture = TestBed.createComponent(MedicationAlertFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
