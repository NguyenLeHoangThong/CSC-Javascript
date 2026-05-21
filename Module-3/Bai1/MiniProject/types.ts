export interface Todo {
  id: number;
  title: string;
  done: boolean;
}

export interface CreateTodoInput {
  title: string;
}
