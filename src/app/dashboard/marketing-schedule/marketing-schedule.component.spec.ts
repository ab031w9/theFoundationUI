import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingScheduleComponent } from './marketing-schedule.component';

describe('MarketingScheduleComponent', () => {
  let component: MarketingScheduleComponent;
  let fixture: ComponentFixture<MarketingScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketingScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
