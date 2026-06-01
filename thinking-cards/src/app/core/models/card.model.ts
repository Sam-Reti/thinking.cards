export interface Card {
  id: string;
  questionText: string;
  categoryId: string;
  cardNumber: number;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
}
