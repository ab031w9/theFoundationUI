import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingLogsViewComponent } from './marketing-logs-view.component';

describe('ViewStudentComponent', () => {
  let component: MarketingLogsViewComponent;
  let fixture: ComponentFixture<MarketingLogsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketingLogsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingLogsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
