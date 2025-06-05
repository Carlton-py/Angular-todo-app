/*import { Component, type OnInit,ViewChild, type ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TodoItem{
  id: number;
  task: string;
  completed: boolean;
}
@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements  OnInit{
  todoList: TodoItem[] = [];
  newTask = '';
  @ViewChild('todoText') todoInputRef!: ElementRef<HTMLInputElement>;
  constructor() { }
  ngOnInit(): void {
    const storedTodoList = localStorage.getItem('todoList');
    if (storedTodoList) {
      this.todoList = JSON.parse(storedTodoList);
    }
  }
  addTask(task:string): void {
    if (task.trim() !== '') {
      const newTodoItem: TodoItem = {
        id: Date.now(),
        task: task.trim(),
        completed: false,
      };
      this.todoList.push(newTodoItem);
      this.newTask = '';
      // Clear the input field after adding the task
      //this.todoInputRef.nativeElement.value = '';
      this.saveTodoList();
    }
  }
  deleteTask (id: number): void {
    this.todoList = this.todoList.filter((item) => item.id !== id);
    this.saveTodoList();
  }
  toggleCompleted(id: number): void {
    const todoItem = this.todoList.find((item) => item.id === id);
    if (todoItem) {
      todoItem.completed = !todoItem.completed;
      this.saveTodoList();
    }
  }
    // Add this new method to safely count completed items
  getCompletedCount(): number {
      return this.todoList.filter((item) => item.completed).length
    }
  saveTodoList(): void {
    localStorage.setItem('todoList', JSON.stringify(this.todoList));
  }



}
*/

//Former new shit
// import { Component, type OnInit, ViewChild, type ElementRef } from "@angular/core"
// import { CommonModule } from "@angular/common"
// import { FormsModule } from "@angular/forms"
// import {SpeechRecognitionService } from "../services/speech-recognition.service"
// //DEfine speechRecognition interface for webkitSpeechRecognition and SpeechRecognition
// // This is to ensure that the TypeScript compiler recognizes these properties on the window object
// declare global {
//   interface Window {
//     webkitSpeechRecognition: any
//     SpeechRecognition: any
//   }
// }


// interface TodoItem {
//   id: number
//   task: string
//   completed: boolean
// }

// @Component({
//   selector: "app-todo-list",
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: "./todo-list.component.html",
//   styleUrls: ["./todo-list.component.css"],
// })
// export class TodoListComponent implements OnInit {
//   todoList: TodoItem[] = []
//   newTask = ""
//   isRecording = false
//   transcribedText = ""
//   @ViewChild("todoText") todoInputRef!: ElementRef<HTMLInputElement>

//   constructor(private speechService: SpeechRecognitionService) {}

//   ngOnInit(): void {
//     const storedTodoList = localStorage.getItem("todoList")
//     if (storedTodoList) {
//       this.todoList = JSON.parse(storedTodoList)
//     }
//   }

//   addTask(task: string): void {
//     if (task.trim() !== "") {
//       const newTodoItem: TodoItem = {
//         id: Date.now(),
//         task: task.trim(),
//         completed: false,
//       }
//       this.todoList.push(newTodoItem)
//       this.newTask = "" // Clear the input field
//       this.saveTodoList()
//     }
//   }

//   deleteTask(id: number): void {
//     this.todoList = this.todoList.filter((item) => item.id !== id)
//     this.saveTodoList()
//   }

//   toggleCompleted(id: number): void {
//     const todoItem = this.todoList.find((item) => item.id === id)
//     if (todoItem) {
//       todoItem.completed = !todoItem.completed
//       this.saveTodoList()
//     }
//   }

//   // Add this new method to safely count completed items
//   getCompletedCount(): number {
//     return this.todoList.filter((item) => item.completed).length
//   }

//   saveTodoList(): void {
//     localStorage.setItem("todoList", JSON.stringify(this.todoList))
//   }
//   //Speech recognition methods

//   toggleRecording():void{
//     if(this.isRecording){
//       this.stopRecording()
//     }else{
//       this.startRecording()
//     }
//   }
//   startRecording():void{
//     this.isRecording = true
//     this.transcribedText = ""

//     this.speechService.startRecording().subscribe({
//       next:(text) =>{
//         this.transcribedText = text
//       },
//       error:(error) =>{
//         console.error("Speech recognition error:", error)
//         this.isRecording = false
//       },
//       complete :() =>{
//         this.isRecording = false
      
//       },

//     })
//   }
//   stopRecording():void{
//     this.isRecording = false
//     this.speechService.stopRecording()
//   }
//   // Methhod to add transcribed text as a new todo
//   addTranscribedTodo(): void {
//     if (this.transcribedText.trim()) {
//       this.addTask(this.transcribedText.trim())
//       this.transcribedText = ""
//     }
//   }
// }

import { Component, type OnInit, ViewChild, type ElementRef } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import  { SpeechRecognitionService } from "../services/speech-recognition.service" // Removed 'type' keyword

// Define speechRecognition interface for webkitSpeechRecognition and SpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

interface TodoItem {
  id: number
  task: string
  completed: boolean
}

@Component({
  selector: "app-todo-list",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./todo-list.component.html",
  styleUrls: ["./todo-list.component.css"],
})
export class TodoListComponent implements OnInit {
  todoList: TodoItem[] = []
  newTask = ""
  isRecording = false
  transcribedText = ""
  autoAddTranscribed = true
  @ViewChild("todoText") todoInputRef!: ElementRef<HTMLInputElement>

  constructor(private speechService: SpeechRecognitionService) {}

  ngOnInit(): void {
    const storedTodoList = localStorage.getItem("todoList")
    if (storedTodoList) {
      this.todoList = JSON.parse(storedTodoList)
    }
  }

  addTask(task: string): void {
    if (task.trim() !== "") {
      const newTodoItem: TodoItem = {
        id: Date.now(),
        task: task.trim(),
        completed: false,
      }
      this.todoList.push(newTodoItem)
      this.newTask = "" // Clear the input field
      this.saveTodoList()
      console.log("Task added:", newTodoItem)
      console.log("Current todo list:", this.todoList)

  
    }
  }

  deleteTask(id: number): void {
    this.todoList = this.todoList.filter((item) => item.id !== id)
    this.saveTodoList()
  }

  toggleCompleted(id: number): void {
    const todoItem = this.todoList.find((item) => item.id === id)
    if (todoItem) {
      todoItem.completed = !todoItem.completed
      this.saveTodoList()
    }
  }

  // Add this new method to safely count completed items
  getCompletedCount(): number {
    return this.todoList.filter((item) => item.completed).length
  }

  saveTodoList(): void {
    localStorage.setItem("todoList", JSON.stringify(this.todoList))
  }

  // Speech recognition methods
  toggleRecording(): void {
    if (this.isRecording) {
      this.stopRecording()
    } else {
      this.startRecording()
    }
  }

  startRecording(): void {
    this.isRecording = true
    this.transcribedText = ""
    console.log("Starting recording...")

    // Show an alert to verify the method is being called
    alert("Recording started. Please speak now.")

    this.speechService.startRecording().subscribe({
      next: (text) => {
        console.log("Received transcription:", text)
        this.transcribedText = text

        // Show the transcribed text in an alert
        if (text) {
          alert("Transcribed: " + text)
        }
      },
      error: (error) => {
        console.error("Speech recognition error:", error)
        this.isRecording = false
        alert("Error: " + error)
      },
      complete: () => {
        console.log("Speech recognition completed")
        this.isRecording = false
        if (this.autoAddTranscribed && this.transcribedText.trim()) {
          console.log("Auto adding transcribed text:", this.transcribedText)
          this.addTranscribedTodo()
        }


      },
    })
  }

  stopRecording(): void {
    this.isRecording = false
    this.speechService.stopRecording()
  }

  // Method to add transcribed text as a new todo
  addTranscribedTodo(): void {
    console.log("Adding transcribed todo:", this.transcribedText)
    if (this.transcribedText.trim()) {
      this.addTask(this.transcribedText.trim())
      this.transcribedText = ""
    }
  }
}




