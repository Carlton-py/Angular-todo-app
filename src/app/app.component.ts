// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { TodoListComponent } from './todo-list/todo-list.component';
// import { RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, CommonModule, TodoListComponent],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css'
// })
// export class AppComponent {
//   title = 'todo-list-app';
// }

import { Component } from "@angular/core"
import { TodoListComponent } from "./todo-list/todo-list.component"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [TodoListComponent],
  template: `
    <div class="app-container">
      <app-todo-list></app-todo-list>
    </div>
  `,
  styles: [
    `
    .app-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
  `,
  ],
})
export class AppComponent {
  title = "angular-todo-with-stt"
}
