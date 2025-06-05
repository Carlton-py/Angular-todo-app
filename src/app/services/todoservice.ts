import { Injectable } from "@angular/core"
import type { TodoItem } from "../models/todo-item.interface"

@Injectable({
  providedIn: "root",
})
export class TodoService {
  private readonly STORAGE_KEY = "angular-todos"

  constructor() {}

  getTodos(): TodoItem[] {
    const storedTodos = localStorage.getItem(this.STORAGE_KEY)
    if (storedTodos) {
      const todos = JSON.parse(storedTodos)
      // Convert string dates back to Date objects
      return todos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }))
    }
    return []
  }

  addTodo(text: string): void {
    const todos = this.getTodos()
    const newTodo: TodoItem = {
      id: this.generateId(),
      text,
      completed: false,
      createdAt: new Date(),
    }

    todos.push(newTodo)
    this.saveTodos(todos)
  }

  toggleComplete(id: string): void {
    const todos = this.getTodos()
    const todoIndex = todos.findIndex((todo) => todo.id === id)

    if (todoIndex !== -1) {
      todos[todoIndex].completed = !todos[todoIndex].completed
      this.saveTodos(todos)
    }
  }

  deleteTodo(id: string): void {
    const todos = this.getTodos()
    const filteredTodos = todos.filter((todo) => todo.id !== id)
    this.saveTodos(filteredTodos)
  }

  clearCompleted(): void {
    const todos = this.getTodos()
    const activeTodos = todos.filter((todo) => !todo.completed)
    this.saveTodos(activeTodos)
  }

  private saveTodos(todos: TodoItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos))
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }
}
