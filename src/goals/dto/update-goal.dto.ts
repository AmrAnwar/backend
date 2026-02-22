import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { GoalStatus } from '../../common/enums/goal-status.enum';
import { IsFutureDate } from '../../common/validators/is-future-date.validator';

export class UpdateGoalDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  @IsFutureDate({ message: 'Deadline must be in the future' })
  deadlineAt?: string;

  @IsEnum(GoalStatus)
  @IsOptional()
  status?: GoalStatus;
}
