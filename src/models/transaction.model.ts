export interface Transaction {
  id: string,
  category: string,
  amount: number,
  date: string,
  type: string,
  description?: string
}
