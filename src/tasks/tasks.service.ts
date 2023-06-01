import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task } from './task.entity';
import { Equal } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { TasksFilterDto } from './dto/tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  public getTasks(filter: TasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filter, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    try {
      const item = await this.tasksRepository.findOne({
        where: {
          id: id,
          user: Equal(user.id),
        },
      });
      if (!item) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return item;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.tasksRepository.createTask(createTaskDto, user);
    return task;
  }

  public async deleteTaskById(id: string, user: User): Promise<void> {
    const task = await this.getTaskById(id, user);
    if (task) this.tasksRepository.delete({ id: id });
  }

  public async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
