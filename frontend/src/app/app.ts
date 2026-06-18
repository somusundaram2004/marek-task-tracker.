import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from './services/task.service';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html'
})
export class App implements OnInit {
  tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Frontend API error:', error);
      }
    });
  }
}