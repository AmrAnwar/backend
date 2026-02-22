import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { IsFutureDate } from '../../common/validators/is-future-date.validator';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  @IsFutureDate({ message: 'Deadline must be in the future' })
  deadlineAt?: string;
}
