import { IsString, IsOptional, IsBoolean, MaxLength, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed: boolean = false;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
