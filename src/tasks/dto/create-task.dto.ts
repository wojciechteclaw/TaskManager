import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Clean my room',
    required: true,
  })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Make it shine like a diamond',
    required: true,
  })
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description: string;
}
