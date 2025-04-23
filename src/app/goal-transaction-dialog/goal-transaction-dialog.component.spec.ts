import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalTransactionDialogComponent } from './goal-transaction-dialog.component';

describe('GoalTransactionDialogComponent', () => {
  let component: GoalTransactionDialogComponent;
  let fixture: ComponentFixture<GoalTransactionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalTransactionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalTransactionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
