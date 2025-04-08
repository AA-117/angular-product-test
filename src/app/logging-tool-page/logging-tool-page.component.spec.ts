import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggingToolPageComponent } from './logging-tool-page.component';

describe('LoggingToolPageComponent', () => {
  let component: LoggingToolPageComponent;
  let fixture: ComponentFixture<LoggingToolPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggingToolPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoggingToolPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
