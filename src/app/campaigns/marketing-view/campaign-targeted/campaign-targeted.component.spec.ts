import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignTargetedComponent } from './campaign-targeted.component';

describe('CampaignTargetedComponent', () => {
  let component: CampaignTargetedComponent;
  let fixture: ComponentFixture<CampaignTargetedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignTargetedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignTargetedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
