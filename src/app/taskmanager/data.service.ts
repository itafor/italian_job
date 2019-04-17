import { Injectable } from '@angular/core';
import { TaskInterface, Columns } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class TaskManagerDataService {
  private cachedTask: TaskInterface;
  private cachedColumns: Columns[];
  private projectName: string = null;

  getCachedTask() {
    return this.cachedTask;
  }

  setCachedTask(task: TaskInterface) {
    this.cachedTask = task;
  }

  setCachedColumns(columns: Columns[]) {
    this.cachedColumns = columns;
  }

  getCachedColumns() {
    return this.cachedColumns || [];
  }

  setProjectName(name: string) {
    this.projectName = name;
  }

  getProjectName(): string {
    return this.projectName;
  }

  invalidateTaskCache(): void {
    this.cachedTask = null;
    this.projectName = null;
  }
}
