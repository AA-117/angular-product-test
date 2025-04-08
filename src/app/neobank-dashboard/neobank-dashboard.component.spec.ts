import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeobankDashboardComponent } from './neobank-dashboard.component';

describe('NeobankDashboardComponent', () => {
  let component: NeobankDashboardComponent;
  let fixture: ComponentFixture<NeobankDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeobankDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeobankDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
