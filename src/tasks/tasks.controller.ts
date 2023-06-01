import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksFilterDto } from './dto/tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { TaskInterceptor } from './task.interceptor';

@ApiTags('Tasks')
@Controller('tasks')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseInterceptors(TaskInterceptor)
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}
  @Get('')
  @ApiOkResponse({ description: 'Tasks found' })
  @ApiQuery({
    name: 'status',
    enum: ['OPEN', 'IN_PROGRESS', 'DONE'],
    required: false,
  })
  @ApiQuery({ name: 'search', type: String, required: false })
  public async getTasks(
    @Query() filter: TasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filter, user);
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'Task found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task | null> {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/:id')
  @ApiOkResponse({ description: 'Task deleted' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  public async deleteTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    await this.tasksService.deleteTaskById(id, user);
  }
  @Post('/new')
  @ApiOkResponse({ description: 'Task created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async createTask(
    @Body() body: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(body, user);
  }

  @Patch('/:id/status')
  @ApiOkResponse({ description: 'Task status updated' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async updateTaskStatus(
    @Param('id') id: string,
    @Body() taskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<void> {
    const { status } = taskStatusDto;
    await this.tasksService.updateTaskStatus(id, status, user);
  }
}
