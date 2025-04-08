import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenaiPageComponent } from './openai-page.component';

describe('OpenaiPageComponent', () => {
  let component: OpenaiPageComponent;
  let fixture: ComponentFixture<OpenaiPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenaiPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenaiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
