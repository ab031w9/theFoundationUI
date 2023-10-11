import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignApprovalsComponent } from './campaign-approvals.component';

describe('CampaignApprovalsComponent', () => {
  let component: CampaignApprovalsComponent;
  let fixture: ComponentFixture<CampaignApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignApprovalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
