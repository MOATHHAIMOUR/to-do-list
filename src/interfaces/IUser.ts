import { ITodo } from "./ITodo";

export interface IUser {
  blocked: boolean;
  confirmed: boolean;
  createdAt: string;
  documentId: string;
  email: string;
  id: number;
  provider: string;
  publishedAt: string;
  todos: ITodo[];
  updatedAt: string;
  username: string;
}
