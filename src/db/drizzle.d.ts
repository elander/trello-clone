import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import * as schema from './schema';

declare global {
  type Board = InferSelectModel<typeof schema.boards>;
  type NewBoard = InferInsertModel<typeof schema.boards>;
  
  type List = InferSelectModel<typeof schema.lists> & {
    cards?: Card[];
  };
  type NewList = InferInsertModel<typeof schema.lists>;
  
  type Card = InferSelectModel<typeof schema.cards>;
  type NewCard = InferInsertModel<typeof schema.cards>;
}
