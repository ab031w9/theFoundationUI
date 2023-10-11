import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureCampaignComponent } from './capture-campaign.component';

describe('CaptureCampaignComponent', () => {
  let component: CaptureCampaignComponent;
  let fixture: ComponentFixture<CaptureCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptureCampaignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptureCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
