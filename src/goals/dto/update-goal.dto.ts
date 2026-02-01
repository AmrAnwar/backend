import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { GoalStatus } from '../../common/enums/goal-status.enum';

export class UpdateGoalDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsDateString()
  @IsOptional()
  deadlineAt?: string;

  @IsEnum(GoalStatus)
  @IsOptional()
  status?: GoalStatus;
}
