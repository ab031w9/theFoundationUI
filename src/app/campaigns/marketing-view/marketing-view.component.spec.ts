import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingViewComponent } from './marketing-view.component';

describe('ViewStudentComponent', () => {
  let component: MarketingViewComponent;
  let fixture: ComponentFixture<MarketingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketingViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
