import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryPasswordFormComponent } from './recovery-password-form.component';

describe('RecoveryPasswordFormComponent', () => {
  let component: RecoveryPasswordFormComponent;
  let fixture: ComponentFixture<RecoveryPasswordFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecoveryPasswordFormComponent]
    });
    fixture = TestBed.createComponent(RecoveryPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
