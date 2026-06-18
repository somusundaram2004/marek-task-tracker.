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
  filteredTasks: Task[] = [];
  statusFilter: string = 'All';
  priorityFilter: string = 'All';

  get totalTasks(): number {
    return this.tasks.length;
  }

  get pendingCount(): number {
    return this.tasks.filter((task) => !task.is_done).length;
  }

  get completedCount(): number {
    return this.tasks.filter((task) => task.is_done).length;
  }

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
        this.applyFilters();
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter((task) => {
      const matchesStatus =
        this.statusFilter === 'All' ||
        (this.statusFilter === 'Pending' && !task.is_done) ||
        (this.statusFilter === 'Done' && task.is_done);

      const matchesPriority =
        this.priorityFilter === 'All' ||
        task.priority === this.priorityFilter;

      return matchesStatus && matchesPriority;
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

  toggleTask(task: Task): void {
    this.taskService.toggleTaskStatus(task.id!).subscribe({
      next: () => {
        this.loadTasks();
      }
    });
  }

  deleteTask(id: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this task?');

    if (!confirmDelete) {
      return;
    }

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks();
      }
    });
  }
}
