export interface SavingGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  created: Date,
  deadline?: Date;
  category?: string;
  notes?: string;
  index: number;
}
