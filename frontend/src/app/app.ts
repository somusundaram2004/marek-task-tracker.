import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from './services/task.service';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html'
})
export class App implements OnInit {
  tasks: Task[] = [];

  newTask: Task = {
    title: '',
    description: '',
    due_date: '',
    priority: 'Medium',
    is_done: false
  };

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.cdr.detectChanges();
      }
    });
  }

  addTask(): void {
    if (!this.newTask.title.trim()) {
      alert('Task title is required');
      return;
    }

    this.taskService.createTask(this.newTask).subscribe({
      next: () => {
        this.newTask = {
          title: '',
          description: '',
          due_date: '',
          priority: 'Medium',
          is_done: false
        };
        this.loadTasks();
      }
    });
  }
}