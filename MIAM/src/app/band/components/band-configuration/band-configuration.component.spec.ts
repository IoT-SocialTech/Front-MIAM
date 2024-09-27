import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandConfigurationComponent } from './band-configuration.component';

describe('BandConfigurationComponent', () => {
  let component: BandConfigurationComponent;
  let fixture: ComponentFixture<BandConfigurationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BandConfigurationComponent]
    });
    fixture = TestBed.createComponent(BandConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
