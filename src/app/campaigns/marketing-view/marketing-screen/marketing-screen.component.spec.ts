import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingScreenComponent } from './marketing-screen.component';

describe('MarketingScreenComponent', () => {
  let component: MarketingScreenComponent;
  let fixture: ComponentFixture<MarketingScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketingScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
